import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConstraintAnalysisResult } from './constraint-analyzer';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * GEMINI CONSTRAINT SUGGESTIONS (30% AI)
 * 
 * Uses Gemini ONLY to generate mitigation suggestions
 * based on deterministic constraint analysis results.
 * 
 * Gemini does NOT:
 * - Calculate constraint levels
 * - Make feasibility decisions
 * - Invent numbers or budgets
 * 
 * Gemini DOES:
 * - Convert technical findings into actionable advice
 * - Suggest practical mitigation strategies
 * - Provide context-aware recommendations
 */
export async function generateConstraintSuggestions(
  constraints: ConstraintAnalysisResult,
  sceneDescription: string
): Promise<ConstraintAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `You are a film production advisor. Based on the constraint analysis below, provide 2-3 concise, actionable mitigation suggestions for EACH constraint category.

SCENE: ${sceneDescription}

CONSTRAINT ANALYSIS (ALGORITHMIC OUTPUT - DO NOT CHANGE LEVELS):

1. BUDGET CONSTRAINT: ${constraints.budget.level}
   Drivers: ${constraints.budget.primaryDrivers.join(', ')}

2. LOGISTICS CONSTRAINT: ${constraints.logistics.level}
   Bottlenecks: ${constraints.logistics.primaryBottlenecks.join(', ')}

3. SAFETY CONSTRAINT: ${constraints.safety.level}
   Concerns: ${constraints.safety.safetyConcerns.join(', ')}

4. TECHNICAL CONSTRAINT: ${constraints.technical.level}
   Challenges: ${constraints.technical.technicalChallenges.join(', ')}

RULES:
- Provide 2-3 specific, actionable suggestions per constraint
- Focus on practical mitigation strategies
- Do NOT suggest budget amounts or specific costs
- Do NOT override the constraint levels
- Keep each suggestion to 1 sentence
- Be realistic and production-focused

Return ONLY a JSON object with this structure:
{
  "budget": ["suggestion 1", "suggestion 2"],
  "logistics": ["suggestion 1", "suggestion 2"],
  "safety": ["suggestion 1", "suggestion 2"],
  "technical": ["suggestion 1", "suggestion 2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const suggestions = JSON.parse(jsonText);

    // Merge suggestions into constraint analysis
    return {
      budget: {
        ...constraints.budget,
        suggestions: suggestions.budget || [],
      },
      logistics: {
        ...constraints.logistics,
        suggestions: suggestions.logistics || [],
      },
      safety: {
        ...constraints.safety,
        suggestions: suggestions.safety || [],
      },
      technical: {
        ...constraints.technical,
        suggestions: suggestions.technical || [],
      },
    };
  } catch (error) {
    console.error('Failed to generate constraint suggestions:', error);
    // Return original constraints without suggestions if Gemini fails
    return constraints;
  }
}
