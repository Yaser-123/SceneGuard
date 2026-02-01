import { GoogleGenerativeAI } from '@google/generative-ai';

// ===========================
// LLM-DRIVEN RISK ASSESSMENT
// ===========================
// Uses Gemini to holistically assess production risks from scene text
// No keyword matching, no rigid rules - semantic understanding only

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface RiskAssessment {
  category: 'Budget' | 'Logistics' | 'Safety' | 'Technical';
  level: RiskLevel;
  reasoning: string; // Scene-grounded explanation
  mitigationSteps: string[]; // Max 3 steps
}

export interface PermitInsuranceAssessment {
  required: boolean;
  reasoning: string;
  types: string[]; // e.g., ["filming permit", "liability insurance"]
}

export interface LLMRiskAnalysis {
  risks: RiskAssessment[];
  permitInsurance: PermitInsuranceAssessment;
  feasibilityScore: number; // 25-95
  feasibilityReasoning: string;
  categoryRiskLevels: {
    budget: RiskLevel;
    logistics: RiskLevel;
    safety: RiskLevel;
    technical: RiskLevel;
  };
}

const RISK_ASSESSMENT_PROMPT = `You are a film production risk analyst evaluating a scene description.

Your job is to assess REALISTIC production risks across 4 categories:
- Budget: Cost implications
- Logistics: Coordination complexity
- Safety: Physical danger to cast/crew
- Technical: Equipment and expertise requirements

CRITICAL INSTRUCTIONS:

1. SAFETY RISK ASSESSMENT:
   - Consider ALL physical danger, not just stunts/vehicles
   - Assess: water proximity, darkness, visibility, terrain, environmental hazards
   - Evaluate: movement constraints, weather, confined spaces, heights
   - Examples:
     * Night outdoor movement = Medium/High safety risk
     * Shore/water + darkness = High safety risk
     * Unstable terrain (pebbles, slopes) = Medium/High risk
     * Low visibility + human activity = Medium/High risk
   - DO NOT default to Low just because no stunts mentioned

2. PERMITS & INSURANCE:
   - Base on CONTEXT, not just keywords
   - Required for: public spaces, regulated activities, large crowds, authorities involved
   - NOT required for: simple controlled scenes, private property, standard filming
   - Decouple from safety risk (safe scenes may need permits, dangerous scenes may not)

3. RISK LEVELS:
   - High: Significant complexity, danger, or resource requirements
   - Medium: Moderate challenges requiring planning
   - Low: Standard production protocols sufficient

4. MITIGATIONS:
   - Maximum 3 steps per risk category
   - Ground in specific scene elements
   - Be actionable and realistic
   - NO generic templates

5. FEASIBILITY SCORE:
   - Range: 25-95 (NEVER 100)
   - Consider cumulative risk across all categories
   - Lower score = more production challenges

SCENE CONTEXT (if provided):
- Scene Category: {sceneCategory}
- Time of Day: {timeOfDay}
- Location: {location}
- Budget Constraint: {budgetConstraint}

Return STRICT JSON ONLY in this format:

{
  "risks": [
    {
      "category": "Budget|Logistics|Safety|Technical",
      "level": "Low|Medium|High",
      "reasoning": "Scene-specific explanation grounded in the text",
      "mitigationSteps": ["step 1", "step 2", "step 3"]
    }
  ],
  "permitInsurance": {
    "required": true|false,
    "reasoning": "Context-based explanation",
    "types": ["filming permit", "liability insurance"]
  },
  "feasibilityScore": 75,
  "feasibilityReasoning": "Brief explanation of score"
}

IMPORTANT:
- Include risk for EACH category (Budget, Logistics, Safety, Technical)
- Each risk must have realistic level based on scene complexity
- Mitigations must be specific to scene elements, max 3 per category
- Feasibility score reflects cumulative production readiness (25-95)
- If a category has no significant risks, mark as "Low" with brief reasoning

Scene Description:
"""
{sceneText}
"""

Assess the production risks:`;

/**
 * Uses LLM to holistically assess production risks from scene description
 */
export async function assessRisksWithLLM(
  sceneText: string,
  context?: {
    sceneCategory?: string;
    timeOfDay?: string;
    location?: string;
    budgetConstraint?: string;
  }
): Promise<LLMRiskAnalysis> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.3, // Moderate creativity while maintaining consistency
      }
    });

    // Build prompt with context
    let prompt = RISK_ASSESSMENT_PROMPT
      .replace('{sceneText}', sceneText)
      .replace('{sceneCategory}', context?.sceneCategory || 'Not specified')
      .replace('{timeOfDay}', context?.timeOfDay || 'Not specified')
      .replace('{location}', context?.location || 'Not specified')
      .replace('{budgetConstraint}', context?.budgetConstraint || 'Not specified');

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from LLM response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!analysis.risks || !Array.isArray(analysis.risks)) {
      throw new Error('Invalid LLM response: missing risks array');
    }

    // Enforce max 3 mitigations per risk
    analysis.risks.forEach((risk: RiskAssessment) => {
      if (risk.mitigationSteps && risk.mitigationSteps.length > 3) {
        risk.mitigationSteps = risk.mitigationSteps.slice(0, 3);
      }
    });

    // Ensure feasibility score is 25-95
    if (analysis.feasibilityScore < 25) analysis.feasibilityScore = 25;
    if (analysis.feasibilityScore > 95) analysis.feasibilityScore = 95;

    // Extract category risk levels from risks array
    const categoryRiskLevels = {
      budget: 'Low' as RiskLevel,
      logistics: 'Low' as RiskLevel,
      safety: 'Low' as RiskLevel,
      technical: 'Low' as RiskLevel,
    };

    analysis.risks.forEach((risk: RiskAssessment) => {
      const categoryKey = risk.category.toLowerCase() as keyof typeof categoryRiskLevels;
      if (categoryRiskLevels[categoryKey]) {
        categoryRiskLevels[categoryKey] = risk.level;
      }
    });

    return {
      ...analysis,
      categoryRiskLevels,
    };
  } catch (error) {
    console.error('Error in LLM risk assessment:', error);
    
    // Fallback to safe defaults
    return {
      risks: [
        {
          category: 'Budget',
          level: 'Low',
          reasoning: 'Assessment unavailable - defaulting to Low',
          mitigationSteps: [],
        },
        {
          category: 'Logistics',
          level: 'Low',
          reasoning: 'Assessment unavailable - defaulting to Low',
          mitigationSteps: [],
        },
        {
          category: 'Safety',
          level: 'Low',
          reasoning: 'Assessment unavailable - defaulting to Low',
          mitigationSteps: [],
        },
        {
          category: 'Technical',
          level: 'Low',
          reasoning: 'Assessment unavailable - defaulting to Low',
          mitigationSteps: [],
        },
      ],
      permitInsurance: {
        required: false,
        reasoning: 'Assessment unavailable',
        types: [],
      },
      feasibilityScore: 50,
      feasibilityReasoning: 'Unable to complete assessment',
      categoryRiskLevels: {
        budget: 'Low',
        logistics: 'Low',
        safety: 'Low',
        technical: 'Low',
      },
    };
  }
}
