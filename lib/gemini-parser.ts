import { GoogleGenerativeAI } from '@google/generative-ai';
import NodeCache from 'node-cache';
import Bottleneck from 'bottleneck';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize cache for storing results
const sceneCache = new NodeCache({ stdTTL: 3600 }); // Cache results for 1 hour

// Rate-limiting variables
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 20;
const RESET_INTERVAL = 60000; // 1 minute in milliseconds

// Reset request count every minute
setInterval(() => {
  requestCount = 0;
}, RESET_INTERVAL);

// Initialize a request queue with Bottleneck
const limiter = new Bottleneck({
  maxConcurrent: 1, // Process one request at a time
  minTime: 5000, // Minimum 5 seconds between requests
});

export interface GeminiParsedScene {
  hasCrowd: boolean;
  hasStunts: boolean;
  hasVehicles: boolean;
  actionIntensity: 'Low' | 'Medium' | 'High';
  environmentComplexity: 'Low' | 'Medium' | 'High';
  description?: string; // Added field
  environmentSignals?: Record<string, any>; // Added field
}

/**
 * GEMINI PARSER - STRICT JSON OUTPUT ONLY
 * This function uses Gemini ONLY to extract structured facts.
 * Gemini MUST NOT assign risk levels or scores.
 */
export async function parseSceneDescription(
  sceneDescription: string
): Promise<GeminiParsedScene> {
  // Check cache first
  const cachedResult = sceneCache.get(sceneDescription);
  if (cachedResult) {
    return cachedResult as GeminiParsedScene;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `You are a film production scene analyzer. Your ONLY job is to extract factual information from scene descriptions.

DO NOT assign risk levels, scores, or make recommendations. Only identify facts.

Analyze this scene description and return STRICT JSON with these exact fields:

{
  "hasCrowd": boolean,
  "hasStunts": boolean,
  "hasVehicles": boolean,
  "actionIntensity": "Low" | "Medium" | "High",
  "environmentComplexity": "Low" | "Medium" | "High",
  "description": string,
  "environmentSignals": Record<string, any>
}

Rules:
- hasCrowd: true if extras, background actors, or crowds mentioned
- hasStunts: true if stunts, fight choreography, or dangerous actions mentioned
- hasVehicles: true if cars, motorcycles, or any vehicles mentioned
- actionIntensity: Low (dialogue-heavy), Medium (moderate movement), High (chase, fight, explosion)
- environmentComplexity: Low (simple room), Medium (multi-room or detailed outdoor), High (complex set, multiple locations)

Scene Description:
${sceneDescription}

Return ONLY valid JSON with no additional text or explanation.`;

  try {
    let retries = 5;
    let delay = 5000; // Initial delay for exponential backoff

    while (retries > 0) {
      try {
        // Use the limiter to throttle requests
        const result = await limiter.schedule(() => model.generateContent(prompt));
        const response = result.response;
        const text = response.text();

        // Remove markdown code blocks if present
        const cleanedText = text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        const parsed = JSON.parse(cleanedText) as GeminiParsedScene;

        // Validate the response structure
        if (
          typeof parsed.hasCrowd !== 'boolean' ||
          typeof parsed.hasStunts !== 'boolean' ||
          typeof parsed.hasVehicles !== 'boolean' ||
          !['Low', 'Medium', 'High'].includes(parsed.actionIntensity) ||
          !['Low', 'Medium', 'High'].includes(parsed.environmentComplexity)
        ) {
          throw new Error('Invalid Gemini response structure');
        }

        // Cache the result
        sceneCache.set(sceneDescription, parsed);

        return parsed;
      } catch (error) {
        console.error('Error in Gemini request:', error);
        const err = error as any;
        if ((err.message && err.message.includes('429')) || (err.code && err.code === 429) && retries > 0) {
          console.warn('Rate limit hit. Retrying with exponential backoff...');
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Double the delay for exponential backoff
          retries--;
        } else {
          throw error;
        }
      }
    }

    throw new Error('Failed to parse scene description after retries.');
  } catch (error) {
    console.error('Gemini parsing error:', error);
    throw new Error('Failed to parse scene description with Gemini');
  }
}
