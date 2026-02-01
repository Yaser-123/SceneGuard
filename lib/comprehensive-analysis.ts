import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * COMPREHENSIVE PRODUCTION ANALYSIS (100% AI-GENERATED)
 * Generates complete production breakdown including:
 * - Risk categories with detailed explanations
 * - Planning warnings
 * - Mitigation steps
 * - Production checklist items
 * - Feasibility assessment
 */

export interface RiskCategory {
  name: 'Budget' | 'Logistics' | 'Safety' | 'Technical';
  level: 'Low' | 'Medium' | 'High';
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  explanation: string; // Detailed AI-generated explanation
}

export interface PlanningWarning {
  type: 'scheduling' | 'budget' | 'resource' | 'safety' | 'technical';
  severity: 'critical' | 'moderate' | 'minor';
  message: string;
}

export interface MitigationStep {
  step: number;
  description: string;
  category: 'Budget' | 'Logistics' | 'Safety' | 'Technical';
}

export interface ProductionChecklistItem {
  title: string;
  description: string;
  affectedBy: string; // What aspect of the scene affects this
  constraintLevel: 'Low' | 'Medium' | 'High';
}

export interface ProductionReadinessData {
  score: number; // 0-100
  level: 'Low Risk' | 'Medium Risk' | 'High Risk';
  description: string; // Comprehensive AI-generated assessment
}

export interface ComprehensiveAnalysis {
  productionReadiness: ProductionReadinessData;
  riskCategories: RiskCategory[];
  planningWarnings: PlanningWarning[];
  mitigationSteps: MitigationStep[];
  productionChecklist: ProductionChecklistItem[];
  feasibilityScore: number;
}

const COMPREHENSIVE_ANALYSIS_PROMPT = `You are an expert film production analyst. Analyze this scene and provide a complete production breakdown.

SCENE DESCRIPTION:
{sceneText}

SCENE METADATA:
- Category: {sceneCategory}
- Time of Day: {timeOfDay}
- Location Type: {locationType}

Generate a COMPREHENSIVE production analysis with the following components:

1. PRODUCTION READINESS (0-100 score):
   - Assess overall producibility
   - Consider: location access, safety, technical feasibility, budget implications
   - Provide detailed 2-3 sentence explanation of challenges and manageability
   - Assign risk level: "Low Risk" (75-100), "Medium Risk" (50-74), "High Risk" (0-49)

2. RISK CATEGORIES (exactly 4):
   For Budget, Logistics, Safety, Technical - provide:
   - Level: Low/Medium/High
   - Priority: High Priority/Medium Priority/Low Priority
   - Detailed explanation (2-3 sentences) grounded in scene specifics

3. PLANNING WARNINGS:
   - Identify 0-5 specific production alerts
   - Types: scheduling, budget, resource, safety, technical
   - Severity: critical, moderate, minor
   - Each warning should be actionable and scene-specific
   - If no significant warnings: return empty array

4. MITIGATION STEPS:
   - Generate 8-12 numbered, actionable steps
   - Each step must be specific to THIS scene
   - Categorize each: Budget/Logistics/Safety/Technical
   - Order by production phase: pre-production → production → post
   - Be concrete (e.g., "Scout and map the exact access route" not "Plan logistics")

5. PRODUCTION CHECKLIST (exactly 3 items):
   - "Hire Key Production Heads": List specific roles needed (DP, AD, etc.)
   - "Scout & Secure Locations": Permissions, accessibility, specific requirements
   - "Prepare Art Department": Sets, props, costumes specific to scene
   - For each item:
     * Affected by: What scene element creates the constraint
     * Constraint level: Low/Medium/High

CRITICAL RULES:
- NO generic advice - everything must be scene-specific
- NO placeholder text or templates
- Be realistic about actual production constraints
- Consider budget, timeline, safety, technical execution
- Feasibility score should reflect actual difficulty (range: 45-95, never 100)

Return ONLY valid JSON with this exact structure:
{
  "productionReadiness": {
    "score": 75,
    "level": "Low Risk",
    "description": "The scene is achievable with careful planning..."
  },
  "riskCategories": [
    {
      "name": "Budget",
      "level": "Low",
      "priority": "Low Priority",
      "explanation": "The scene description is simple and does not imply significant additional costs..."
    },
    {
      "name": "Logistics",
      "level": "Medium",
      "priority": "Medium Priority",
      "explanation": "Accessing a remote woodland location..."
    },
    {
      "name": "Safety",
      "level": "Medium",
      "priority": "High Priority",
      "explanation": "While no overt stunts are described..."
    },
    {
      "name": "Technical",
      "level": "Medium",
      "priority": "Medium Priority",
      "explanation": "Capturing the specific lighting effect..."
    }
  ],
  "planningWarnings": [
    {
      "type": "safety",
      "severity": "moderate",
      "message": "Child actor in outdoor terrain requires dedicated safety officer"
    }
  ],
  "mitigationSteps": [
    {
      "step": 1,
      "description": "Secure a suitable woodland location with the desired natural elements.",
      "category": "Logistics"
    },
    {
      "step": 2,
      "description": "Budget for standard crew and equipment for a day shoot.",
      "category": "Budget"
    }
  ],
  "productionChecklist": [
    {
      "title": "Hire Key Production Heads",
      "description": "Director of Photography, Production Designer, Assistant Director, Line Producer",
      "affectedBy": "Technical complexity requires specialized crew",
      "constraintLevel": "Medium"
    },
    {
      "title": "Scout & Secure Locations",
      "description": "Permissions, accessibility, power, weather risks, crowd control",
      "affectedBy": "Logistics constraint level",
      "constraintLevel": "Medium"
    },
    {
      "title": "Prepare Art Department",
      "description": "Sets, props, costumes, makeup, stunts, equipment insurance",
      "affectedBy": "Technical requirements",
      "constraintLevel": "Medium"
    }
  ],
  "feasibilityScore": 75
}`;

export async function generateComprehensiveAnalysis(
  sceneText: string,
  context?: {
    sceneCategory?: string;
    timeOfDay?: string;
    locationType?: string;
  }
): Promise<ComprehensiveAnalysis> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.4, // Balanced creativity for detailed analysis
        responseMimeType: 'application/json',
      }
    });

    const prompt = COMPREHENSIVE_ANALYSIS_PROMPT
      .replace('{sceneText}', sceneText)
      .replace('{sceneCategory}', context?.sceneCategory || 'Not specified')
      .replace('{timeOfDay}', context?.timeOfDay || 'Not specified')
      .replace('{locationType}', context?.locationType || 'Not specified');

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse JSON response
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysis: ComprehensiveAnalysis = JSON.parse(jsonText);

    // Validate and ensure score is within bounds
    analysis.feasibilityScore = Math.max(45, Math.min(95, analysis.feasibilityScore));
    analysis.productionReadiness.score = Math.max(45, Math.min(95, analysis.productionReadiness.score));

    return analysis;
  } catch (error) {
    console.error('Failed to generate comprehensive analysis:', error);
    
    // Fallback to minimal analysis
    return {
      productionReadiness: {
        score: 50,
        level: 'Medium Risk',
        description: 'Analysis generation failed. Manual review recommended for accurate assessment.',
      },
      riskCategories: [
        {
          name: 'Budget',
          level: 'Medium',
          priority: 'Medium Priority',
          explanation: 'Unable to assess - manual review needed.',
        },
        {
          name: 'Logistics',
          level: 'Medium',
          priority: 'Medium Priority',
          explanation: 'Unable to assess - manual review needed.',
        },
        {
          name: 'Safety',
          level: 'Medium',
          priority: 'High Priority',
          explanation: 'Unable to assess - manual review needed.',
        },
        {
          name: 'Technical',
          level: 'Medium',
          priority: 'Medium Priority',
          explanation: 'Unable to assess - manual review needed.',
        },
      ],
      planningWarnings: [],
      mitigationSteps: [],
      productionChecklist: [
        {
          title: 'Hire Key Production Heads',
          description: 'Standard crew required',
          affectedBy: 'Analysis incomplete',
          constraintLevel: 'Medium',
        },
        {
          title: 'Scout & Secure Locations',
          description: 'Location requirements unclear',
          affectedBy: 'Analysis incomplete',
          constraintLevel: 'Medium',
        },
        {
          title: 'Prepare Art Department',
          description: 'Art department needs assessment',
          affectedBy: 'Analysis incomplete',
          constraintLevel: 'Medium',
        },
      ],
      feasibilityScore: 50,
    };
  }
}
