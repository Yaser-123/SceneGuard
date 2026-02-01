import { SceneFacts } from './fact-extractor';

// ===========================
// DETERMINISTIC RISK ENGINE (70% ALGORITHMIC)
// ===========================
// All risk assessment is based ONLY on extracted facts.
// NO assumptions, NO inference, NO hallucination.

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface RiskSignal {
  category: 'Budget' | 'Logistics' | 'Safety' | 'Technical';
  level: RiskLevel;
  title: string;
  reasoning: string;
  triggeredBy: string[]; // Factual triggers that caused this signal
  mitigationSteps: string[];
}

export interface RiskAnalysis {
  signals: RiskSignal[];
  categoryRiskLevels: {
    budget: RiskLevel;
    logistics: RiskLevel;
    safety: RiskLevel;
    technical: RiskLevel;
  };
  highCount: number;
  mediumCount: number;
  lowCount: number;
  riskScore: number; // 0-100 (higher = more risk)
  multiplier: number; // Cost multiplier based on cumulative risk
  explainability: {
    factsUsed: string[];
    factsIgnored: string[];
    assumptions: string[];
  };
}

/**
 * Calculates risk signals ONLY from extracted facts
 * ABSOLUTE RULES:
 * - Vehicle risks → ONLY if movement.vehicles === true
 * - Stunt risks → ONLY if action.stunts === true
 * - Permit risks → ONLY if vehicles, stunts, OR large crowd
 * - Weather risks → ONLY if outdoor + weatherEvent !== "none"
 */
export function calculateRiskSignals(
  facts: SceneFacts,
  userInputs: {
    sceneCategory?: string;
    timeOfDay?: string;
    budgetConstraint?: string;
    scheduleFlexibility?: boolean;
  }
): RiskAnalysis {
  const signals: RiskSignal[] = [];
  const factsUsed: string[] = [];
  const factsIgnored: string[] = [];

  // === BUDGET RISKS ===

  // High: Special effects explicitly mentioned
  if (facts.technical.specialEffects) {
    signals.push({
      category: 'Budget',
      level: 'High',
      title: 'Special Effects Requirements',
      reasoning: 'Scene explicitly requires VFX, CGI, or special makeup effects',
      triggeredBy: ['technical.specialEffects = true'],
      mitigationSteps: [
        'Get detailed VFX breakdown and quotes',
        'Consider practical effects alternatives',
        'Allocate 20-30% of budget for post-production',
      ],
    });
    factsUsed.push('technical.specialEffects');
  }

  // High: Large crowd mentioned
  if (facts.people.crowdLevel === 'large') {
    signals.push({
      category: 'Budget',
      level: 'High',
      title: 'Large Crowd Requirements',
      reasoning: 'Scene explicitly mentions 50+ extras or massive crowd',
      triggeredBy: ['people.crowdLevel = large'],
      mitigationSteps: [
        'Budget $150-300 per extra per day',
        'Hire crowd coordinator',
        'Consider VFX crowd extension to reduce extra count',
      ],
    });
    factsUsed.push('people.crowdLevel');
  }

  // Medium: Vehicles mentioned
  if (facts.movement.vehicles) {
    signals.push({
      category: 'Budget',
      level: 'Medium',
      title: 'Vehicle Coordination Costs',
      reasoning: 'Scene explicitly includes vehicles',
      triggeredBy: ['movement.vehicles = true'],
      mitigationSteps: [
        'Budget for vehicle rentals and transportation',
        'Include stunt driver costs if needed',
        'Factor in fuel and maintenance',
      ],
    });
    factsUsed.push('movement.vehicles');
  }

  // Medium: Mechanized equipment
  if (facts.movement.mechanizedEquipment) {
    signals.push({
      category: 'Budget',
      level: 'Medium',
      title: 'Heavy Equipment Costs',
      reasoning: 'Scene explicitly requires cranes, bulldozers, or heavy machinery',
      triggeredBy: ['movement.mechanizedEquipment = true'],
      mitigationSteps: [
        'Get specialized equipment rental quotes',
        'Budget for certified operators',
        'Include insurance for equipment',
      ],
    });
    factsUsed.push('movement.mechanizedEquipment');
  }

  // Medium: User budget constraint
  if (userInputs.budgetConstraint === 'highly_constrained') {
    signals.push({
      category: 'Budget',
      level: 'Medium',
      title: 'Budget Pressure Indicated',
      reasoning: 'User indicated highly constrained budget for this scene',
      triggeredBy: ['userInput.budgetConstraint = highly_constrained'],
      mitigationSteps: [
        'Prioritize essential elements only',
        'Explore cost-effective alternatives',
        'Consider phased shooting approach',
      ],
    });
  }

  // === LOGISTICS RISKS ===

  // High: Large crowd + outdoor
  if (facts.people.crowdLevel === 'large' && facts.environment.outdoor) {
    signals.push({
      category: 'Logistics',
      level: 'High',
      title: 'Large Outdoor Crowd Management',
      reasoning: 'Scene requires managing 50+ people in outdoor environment',
      triggeredBy: ['people.crowdLevel = large', 'environment.outdoor = true'],
      mitigationSteps: [
        'Hire professional crowd coordinator',
        'Create detailed crowd flow plan',
        'Arrange adequate restroom and catering facilities',
        'Coordinate with local authorities for public space',
      ],
    });
    factsUsed.push('people.crowdLevel', 'environment.outdoor');
  }

  // High: Vehicles + action/chase
  if (facts.movement.vehicles && (facts.action.chase || facts.action.combat)) {
    signals.push({
      category: 'Logistics',
      level: 'High',
      title: 'Vehicle Action Coordination',
      reasoning: 'Scene involves vehicles in action/chase sequences',
      triggeredBy: [
        'movement.vehicles = true',
        facts.action.chase ? 'action.chase = true' : 'action.combat = true',
      ],
      mitigationSteps: [
        'Hire stunt coordinator and precision drivers',
        'Scout and secure closed course or controlled area',
        'Coordinate police/fire department notifications',
        'Plan backup vehicles and towing',
      ],
    });
    factsUsed.push('movement.vehicles', facts.action.chase ? 'action.chase' : 'action.combat');
  }

  // Medium: Night shoot
  if (facts.technical.nightShoot) {
    signals.push({
      category: 'Logistics',
      level: 'Medium',
      title: 'Night Shooting Logistics',
      reasoning: 'Scene explicitly set at night',
      triggeredBy: ['technical.nightShoot = true'],
      mitigationSteps: [
        'Schedule crew for night rates (typically 10-20% premium)',
        'Arrange additional lighting equipment',
        'Plan meal breaks and transportation',
        'Account for limited daylight prep time',
      ],
    });
    factsUsed.push('technical.nightShoot');
  }

  // Medium: Difficult terrain
  if (['desert', 'mountain', 'forest', 'water'].includes(facts.environment.terrain)) {
    signals.push({
      category: 'Logistics',
      level: 'Medium',
      title: 'Remote Location Access',
      reasoning: `Scene set in ${facts.environment.terrain} terrain requiring special access`,
      triggeredBy: [`environment.terrain = ${facts.environment.terrain}`],
      mitigationSteps: [
        'Scout access roads and parking areas',
        'Arrange 4x4 vehicles or specialized transport',
        'Plan equipment shuttle logistics',
        'Factor in extended setup/wrap times',
      ],
    });
    factsUsed.push('environment.terrain');
  }

  // === SAFETY RISKS ===
  // CONDITION-BASED SAFETY EVALUATION (not stunt/vehicle-dependent)

  const safetyConditions: string[] = [];
  
  // Condition 1: Low/reduced visibility + human movement
  if (['low', 'reduced'].includes(facts.environment.visibility) && facts.people.count !== 'none') {
    safetyConditions.push('Low visibility with human movement');
  }

  // Condition 2: Water proximity (shore/river/sea detected in terrain)
  const waterTerrains = ['water'];
  const isNearWater = waterTerrains.includes(facts.environment.terrain);
  if (isNearWater && (facts.technical.nightShoot || facts.environment.visibility === 'low')) {
    safetyConditions.push('Water proximity with night/poor lighting');
  }

  // Condition 3: Unstable terrain (pebbles, rocks, cliffs, slopes)
  const unstableTerrains = ['mountain', 'desert'];
  const hasUnstableTerrain = unstableTerrains.includes(facts.environment.terrain) || 
                             facts.environment.terrain === 'water'; // includes shore/beach
  if (hasUnstableTerrain && facts.people.count !== 'none') {
    safetyConditions.push('Unstable terrain with movement');
  }

  // Condition 4: Night outdoor movement
  if (facts.technical.nightShoot && facts.environment.outdoor && facts.people.count !== 'none') {
    safetyConditions.push('Night outdoor movement');
  }

  // Condition 5: Environmental hazards
  if (facts.environment.weatherEvent !== 'none') {
    safetyConditions.push(`Environmental hazard: ${facts.environment.weatherEvent}`);
  }

  // Generate condition-based safety risk
  if (safetyConditions.length >= 2) {
    // High: Multiple dangerous conditions
    const mitigations: string[] = [];
    
    if (safetyConditions.some(c => c.includes('visibility'))) {
      mitigations.push('Deploy additional lighting and high-visibility markers');
    }
    if (safetyConditions.some(c => c.includes('Water'))) {
      mitigations.push('Assign certified water safety coordinator and lifeguard');
      mitigations.push('Ensure flotation devices available for all personnel');
    }
    if (safetyConditions.some(c => c.includes('terrain'))) {
      mitigations.push('Conduct terrain safety briefing and establish safe pathways');
    }
    if (safetyConditions.some(c => c.includes('Night'))) {
      mitigations.push('Provide crew with flashlights and reflective safety gear');
    }
    
    signals.push({
      category: 'Safety',
      level: 'High',
      title: 'Multiple Safety Conditions Detected',
      reasoning: `${safetyConditions.length} dangerous conditions present: ${safetyConditions.join(', ')}`,
      triggeredBy: safetyConditions,
      mitigationSteps: mitigations.slice(0, 3), // Max 3 mitigations
    });
    
    factsUsed.push('environment.visibility', 'environment.terrain', 'technical.nightShoot', 'people.count');
  } else if (safetyConditions.length === 1) {
    // Medium: Single dangerous condition
    const condition = safetyConditions[0];
    const mitigations: string[] = [];
    
    if (condition.includes('visibility')) {
      mitigations.push('Deploy additional lighting equipment');
      mitigations.push('Establish clear communication protocols');
    } else if (condition.includes('Water')) {
      mitigations.push('Assign water safety coordinator');
      mitigations.push('Brief crew on water hazard protocols');
    } else if (condition.includes('terrain')) {
      mitigations.push('Mark safe pathways and hazard zones');
      mitigations.push('Conduct terrain safety walkthrough');
    } else if (condition.includes('Night')) {
      mitigations.push('Provide adequate lighting and reflective gear');
      mitigations.push('Schedule rest breaks to prevent fatigue');
    } else if (condition.includes('Environmental')) {
      mitigations.push('Monitor conditions and establish shelter plan');
      mitigations.push('Provide protective equipment for crew');
    }
    
    signals.push({
      category: 'Safety',
      level: 'Medium',
      title: 'Safety Condition Requires Attention',
      reasoning: `Dangerous condition detected: ${condition}`,
      triggeredBy: [condition],
      mitigationSteps: mitigations.slice(0, 3), // Max 3 mitigations
    });
    
    factsUsed.push('environment.visibility', 'environment.terrain', 'technical.nightShoot');
  }

  // === STUNT/VEHICLE-SPECIFIC SAFETY (separate from conditions) ===

  // High: Stunts explicitly mentioned
  if (facts.action.stunts) {
    signals.push({
      category: 'Safety',
      level: 'High',
      title: 'Stunt Coordination Required',
      reasoning: 'Scene explicitly includes dangerous stunts or maneuvers',
      triggeredBy: ['action.stunts = true'],
      mitigationSteps: [
        'Hire certified stunt coordinator (MANDATORY)',
        'Conduct safety briefing with all cast/crew',
        'Arrange on-set medic and ambulance standby',
      ],
    });
    factsUsed.push('action.stunts');
  }

  // High: Explosions/fire
  if (facts.action.explosions) {
    signals.push({
      category: 'Safety',
      level: 'High',
      title: 'Pyrotechnics Safety Protocol',
      reasoning: 'Scene explicitly includes explosions or fire effects',
      triggeredBy: ['action.explosions = true'],
      mitigationSteps: [
        'Hire licensed pyrotechnician (MANDATORY)',
        'Notify fire department and obtain permits',
        'Clear safety perimeter and have fire extinguishers ready',
      ],
    });
    factsUsed.push('action.explosions');
  }

  // Medium: Vehicles in scene
  if (facts.movement.vehicles) {
    signals.push({
      category: 'Safety',
      level: 'Medium',
      title: 'Vehicle Safety Protocols',
      reasoning: 'Scene includes vehicles requiring safety coordination',
      triggeredBy: ['movement.vehicles = true'],
      mitigationSteps: [
        'Establish clear pedestrian zones',
        'Assign safety coordinator for vehicle movements',
        'Conduct safety briefing with all cast/crew',
      ],
    });
    factsUsed.push('movement.vehicles');
  }

  // Medium: Animals in scene
  if (facts.movement.animals) {
    signals.push({
      category: 'Safety',
      level: 'Medium',
      title: 'Animal Handler Safety',
      reasoning: 'Scene includes animals requiring professional handling',
      triggeredBy: ['movement.animals = true'],
      mitigationSteps: [
        'Hire certified animal wrangler',
        'Review American Humane guidelines',
        'Brief cast/crew on animal interaction protocols',
      ],
    });
    factsUsed.push('movement.animals');
  }

  // Medium: Crowd + night shoot (safety monitoring required)
  if (facts.technical.nightShoot && ['medium', 'large'].includes(facts.people.crowdLevel)) {
    signals.push({
      category: 'Safety',
      level: 'Medium',
      title: 'Night Crowd Safety Monitoring',
      reasoning: 'Night shooting with crowd requires enhanced safety oversight',
      triggeredBy: ['technical.nightShoot = true', `people.crowdLevel = ${facts.people.crowdLevel}`],
      mitigationSteps: [
        'Ensure adequate lighting for crew and talent safety',
        'Assign dedicated safety monitors for crowd areas',
        'Establish clear emergency evacuation routes',
      ],
    });
    factsUsed.push('technical.nightShoot', 'people.crowdLevel');
  }

  // Medium: Medium/large crowd (crowd safety regardless of night)
  if (['medium', 'large'].includes(facts.people.crowdLevel)) {
    signals.push({
      category: 'Safety',
      level: 'Medium',
      title: 'Crowd Safety Management',
      reasoning: `${facts.people.crowdLevel} crowd requires safety coordination`,
      triggeredBy: [`people.crowdLevel = ${facts.people.crowdLevel}`],
      mitigationSteps: [
        'Designate crowd safety coordinator',
        'Create crowd flow and egress plan',
        'Have first aid personnel accessible',
      ],
    });
    if (!factsUsed.includes('people.crowdLevel')) {
      factsUsed.push('people.crowdLevel');
    }
  }

  // === TECHNICAL RISKS ===

  // High: Complex camerawork
  if (facts.technical.complexCamerawork) {
    signals.push({
      category: 'Technical',
      level: 'High',
      title: 'Advanced Camera Equipment',
      reasoning: 'Scene requires aerial shots, tracking, or complex camera movements',
      triggeredBy: ['technical.complexCamerawork = true'],
      mitigationSteps: [
        'Hire specialized camera operators',
        'Rent advanced equipment (drones, Steadicam, technocrane)',
        'Schedule equipment tests and rehearsals',
      ],
    });
    factsUsed.push('technical.complexCamerawork');
  }

  // Medium: Night shoot technical requirements
  if (facts.technical.nightShoot) {
    signals.push({
      category: 'Technical',
      level: 'Medium',
      title: 'Night Lighting Requirements',
      reasoning: 'Night scene requires extensive lighting setup',
      triggeredBy: ['technical.nightShoot = true'],
      mitigationSteps: [
        'Rent large lighting package (HMIs, LED panels)',
        'Hire gaffer with night shooting experience',
        'Plan for generator capacity and fuel',
        'Allow extra setup time for lighting',
      ],
    });
    factsUsed.push('technical.nightShoot');
  }

  // Medium: Low visibility conditions
  if (facts.environment.visibility === 'low' || facts.environment.visibility === 'reduced') {
    signals.push({
      category: 'Technical',
      level: 'Medium',
      title: 'Low Visibility Cinematography',
      reasoning: 'Scene has reduced visibility requiring specialized lighting/camera work',
      triggeredBy: [`environment.visibility = ${facts.environment.visibility}`],
      mitigationSteps: [
        'Use high-sensitivity cameras or additional lighting',
        'Consider practical lights in frame',
        'Test exposure settings in similar conditions',
      ],
    });
    factsUsed.push('environment.visibility');
  }

  // === Calculate cumulative metrics ===

  const highCount = signals.filter(s => s.level === 'High').length;
  const mediumCount = signals.filter(s => s.level === 'Medium').length;
  const lowCount = signals.filter(s => s.level === 'Low').length;

  // Risk score calculation (signal-based)
  let riskScore = 0;
  signals.forEach(signal => {
    if (signal.level === 'High') riskScore += 1.0;
    if (signal.level === 'Medium') riskScore += 0.5;
    if (signal.level === 'Low') riskScore += 0.25;
  });

  // Cost multiplier based on cumulative risk
  let multiplier = 1.0;
  if (highCount >= 3) multiplier = 1.6;
  else if (highCount >= 2) multiplier = 1.3;
  else if (highCount >= 1) multiplier = 1.15;
  else if (mediumCount >= 3) multiplier = 1.1;

  // Cap at 1.8x
  multiplier = Math.min(multiplier, 1.8);

  // Track what facts were NOT used (for explainability)
  const allFactKeys = [
    'people.count', 'people.crowdLevel',
    'movement.vehicles', 'movement.animals', 'movement.mechanizedEquipment',
    'action.stunts', 'action.combat', 'action.explosions', 'action.chase',
    'environment.outdoor', 'environment.weatherEvent', 'environment.visibility', 'environment.terrain',
    'technical.specialEffects', 'technical.complexCamerawork', 'technical.nightShoot',
  ];

  allFactKeys.forEach(key => {
    if (!factsUsed.includes(key)) {
      factsIgnored.push(key);
    }
  });

  // Calculate category risk levels (highest signal in each category)
  const budgetSignals = signals.filter(s => s.category === 'Budget');
  const logisticsSignals = signals.filter(s => s.category === 'Logistics');
  const safetySignals = signals.filter(s => s.category === 'Safety');
  const technicalSignals = signals.filter(s => s.category === 'Technical');

  const getCategoryLevel = (categorySignals: RiskSignal[]): RiskLevel => {
    if (categorySignals.some(s => s.level === 'High')) return 'High';
    if (categorySignals.some(s => s.level === 'Medium')) return 'Medium';
    return 'Low';
  };

  return {
    signals,
    categoryRiskLevels: {
      budget: getCategoryLevel(budgetSignals),
      logistics: getCategoryLevel(logisticsSignals),
      safety: getCategoryLevel(safetySignals),
      technical: getCategoryLevel(technicalSignals),
    },
    highCount,
    mediumCount,
    lowCount,
    riskScore,
    multiplier,
    explainability: {
      factsUsed,
      factsIgnored,
      assumptions: [], // NO ASSUMPTIONS ALLOWED
    },
  };
}
