import { GoogleGenerativeAI } from '@google/generative-ai';

// ===========================
// STRICT FACT EXTRACTION (GEMINI = 30%)
// ===========================
// Gemini ONLY extracts observable facts.
// NO risk assessment, NO inference, NO assumptions.

export interface SceneFacts {
  people: {
    count: 'none' | 'one' | 'few' | 'many';
    crowdLevel: 'none' | 'small' | 'medium' | 'large';
  };
  movement: {
    vehicles: boolean;
    animals: boolean;
    mechanizedEquipment: boolean;
  };
  action: {
    stunts: boolean;
    combat: boolean;
    explosions: boolean;
    chase: boolean;
  };
  environment: {
    outdoor: boolean;
    weatherEvent: 'none' | 'dust_storm' | 'rain' | 'snow' | 'fog' | 'wind' | 'heat';
    visibility: 'normal' | 'reduced' | 'low';
    terrain: 'plain' | 'urban' | 'forest' | 'desert' | 'mountain' | 'water' | 'indoor';
  };
  technical: {
    specialEffects: boolean;
    complexCamerawork: boolean;
    nightShoot: boolean;
  };
  uncertaintyFlags: string[];
}

// STRICT FACT-EXTRACTION PROMPT (NO INFERENCE ALLOWED)
const FACT_EXTRACTION_PROMPT = `You are an information extraction system for film production analysis.

Your job is NOT to assess risk, cost, feasibility, permits, insurance, or safety.

Your ONLY job is to extract factual, observable elements that are EXPLICITLY PRESENT in the scene description.

CRITICAL RULES:
- Do NOT infer production requirements
- Do NOT assume filmmaking norms  
- Do NOT guess
- If something is not explicitly stated, mark it as false
- If unsure, return false
- Do NOT add extra fields
- Return STRICT JSON ONLY

EXTRACTION GUIDELINES:

people.count:
  - "none": No people mentioned
  - "one": One person
  - "few": 2-5 people explicitly mentioned
  - "many": More than 5 people or terms like "crowd", "group", "team"

people.crowdLevel:
  - "none": No crowd
  - "small": 10-20 extras/background mentioned
  - "medium": 20-50 people mentioned
  - "large": 50+ people or words like "hundreds", "massive crowd"

movement.vehicles:
  - TRUE only if cars, trucks, motorcycles, boats, aircraft explicitly mentioned
  - FALSE if no vehicles in scene

movement.animals:
  - TRUE only if animals explicitly mentioned (horses, dogs, wildlife)
  - FALSE otherwise

movement.mechanizedEquipment:
  - TRUE only if cranes, bulldozers, heavy machinery mentioned
  - FALSE otherwise

action.stunts:
  - TRUE only if jumping, falling, fights, dangerous maneuvers explicitly described
  - FALSE otherwise

action.combat:
  - TRUE only if fighting, punching, weapons use explicitly described
  - FALSE otherwise

action.explosions:
  - TRUE only if explosions, fire, smoke effects explicitly mentioned
  - FALSE otherwise

action.chase:
  - TRUE only if chase sequence explicitly described
  - FALSE otherwise

environment.outdoor:
  - TRUE if scene is outdoors (desert, street, park, etc.)
  - FALSE if indoors (office, house, studio)

environment.weatherEvent:
  - "dust_storm": Dust/sandstorm explicitly mentioned
  - "rain": Rain explicitly mentioned
  - "snow": Snow/blizzard explicitly mentioned
  - "fog": Fog/mist explicitly mentioned
  - "wind": High winds explicitly mentioned
  - "heat": Extreme heat explicitly mentioned
  - "none": No weather event mentioned

environment.visibility:
  - "low": Darkness, heavy fog mentioned
  - "reduced": Partial obstruction mentioned
  - "normal": Clear conditions or nothing mentioned

environment.terrain:
  - "water": Shore, beach, river, lake, sea, ocean, coast, waterfront
  - "mountain": Mountains, hills, cliffs, slopes, peaks
  - "desert": Desert, dunes, arid land, wasteland
  - "forest": Forest, woods, jungle, trees
  - "urban": City, street, buildings, urban areas
  - "plain": Open field, grassland, flatland
  - "indoor": Inside building, office, house, studio
  - Match EXACT terrain from text, do NOT generalize (e.g., "pebble shore" → "water", NOT "plain")

technical.specialEffects:
  - TRUE only if VFX, CGI, green screen, special makeup explicitly mentioned
  - FALSE otherwise

technical.complexCamerawork:
  - TRUE only if aerial shots, tracking shots, complex camera moves mentioned
  - FALSE otherwise

technical.nightShoot:
  - TRUE only if night/darkness explicitly mentioned
  - FALSE otherwise

uncertaintyFlags:
  - List any ambiguous elements you're uncertain about
  - Empty array if everything is clear

Return STRICT JSON in this schema:

{
  "people": {
    "count": "none|one|few|many",
    "crowdLevel": "none|small|medium|large"
  },
  "movement": {
    "vehicles": false,
    "animals": false,
    "mechanizedEquipment": false
  },
  "action": {
    "stunts": false,
    "combat": false,
    "explosions": false,
    "chase": false
  },
  "environment": {
    "outdoor": true,
    "weatherEvent": "none",
    "visibility": "normal",
    "terrain": "plain"
  },
  "technical": {
    "specialEffects": false,
    "complexCamerawork": false,
    "nightShoot": false
  },
  "uncertaintyFlags": []
}`;

/**
 * Extracts ONLY observable facts from scene text using Gemini
 * NO risk assessment, NO inference, NO assumptions
 */
export async function extractSceneFacts(sceneText: string): Promise<SceneFacts> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.1, // Low temperature for factual extraction
      }
    });

    const prompt = `${FACT_EXTRACTION_PROMPT}

Scene Text:
"""
${sceneText}
"""

Extract observable facts ONLY. Return valid JSON:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }

    const facts = JSON.parse(jsonMatch[0]) as SceneFacts;

    // Validate structure
    if (!facts.people || !facts.movement || !facts.action || !facts.environment || !facts.technical) {
      throw new Error('Incomplete fact extraction from Gemini');
    }

    return facts;
  } catch (error) {
    console.error('Error in fact extraction:', error);
    
    // Fallback to minimal facts (everything false/none)
    return {
      people: {
        count: 'none',
        crowdLevel: 'none',
      },
      movement: {
        vehicles: false,
        animals: false,
        mechanizedEquipment: false,
      },
      action: {
        stunts: false,
        combat: false,
        explosions: false,
        chase: false,
      },
      environment: {
        outdoor: false,
        weatherEvent: 'none',
        visibility: 'normal',
        terrain: 'indoor',
      },
      technical: {
        specialEffects: false,
        complexCamerawork: false,
        nightShoot: false,
      },
      uncertaintyFlags: ['Extraction failed - using safe defaults'],
    };
  }
}

/**
 * Validates extracted facts against scene text
 * Downgrades to false if facts cannot be verified
 */
export function validateFacts(facts: SceneFacts, sceneText: string): SceneFacts {
  const lowerScene = sceneText.toLowerCase();
  const validated = { ...facts };

  // Validate vehicles
  if (facts.movement.vehicles) {
    const vehicleKeywords = ['car', 'truck', 'vehicle', 'motorcycle', 'bike', 'aircraft', 'helicopter', 'boat'];
    const hasVehicleEvidence = vehicleKeywords.some(kw => lowerScene.includes(kw));
    if (!hasVehicleEvidence) {
      validated.movement.vehicles = false;
      validated.uncertaintyFlags.push('Vehicles marked false - no evidence in text');
    }
  }

  // Validate stunts
  if (facts.action.stunts) {
    const stuntKeywords = ['stunt', 'jump', 'fall', 'leap', 'climb', 'swing', 'dangerous'];
    const hasStuntEvidence = stuntKeywords.some(kw => lowerScene.includes(kw));
    if (!hasStuntEvidence) {
      validated.action.stunts = false;
      validated.uncertaintyFlags.push('Stunts marked false - no evidence in text');
    }
  }

  return validated;
}
