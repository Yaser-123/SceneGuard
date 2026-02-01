import { RiskSignal, RiskLevel } from './risk-analyzer';

export type CostPressure = 'Low' | 'Medium' | 'High';

export interface CostDriver {
  category: string;
  impact: string;
}

export interface CostInputs {
  extrasRange?: 'none' | 'small' | 'medium' | 'large';
  controlledSet?: boolean;
  scheduleFlexibility?: boolean;
  locationComplexity?: 'city' | 'remote' | 'studio';
  unionCrew?: boolean;
  budgetConstraint?: 'highly_constrained' | 'moderately_constrained' | 'flexible' | 'not_specified';
}

export interface CostImpactResult {
  costPressure: CostPressure;
  drivers: CostDriver[];
  explanation: string;
  suggestions?: string; // Gemini-generated optimization suggestions
}

/**
 * COST IMPACT ENGINE (QUALITATIVE)
 * Maps risk signals to cost drivers
 * Incorporates user-provided cost inputs for better accuracy
 * No numeric budgets - only qualitative assessment
 */
export function analyzeCostImpact(
  riskSignals: RiskSignal[],
  sceneCategory: 'Indoor' | 'Outdoor' | 'VFX',
  multiplier: number,
  costInputs?: CostInputs
): CostImpactResult {
  const drivers: CostDriver[] = [];

  // === MAP RISKS TO COST DRIVERS ===
  riskSignals.forEach((signal) => {
    switch (signal.name) {
      case 'Crowd Management':
        drivers.push({
          category: 'Extras & Casting',
          impact: 'Significant cost increase for background actors and crowd coordinators',
        });
        drivers.push({
          category: 'Crew Expansion',
          impact: 'Additional assistant directors and production assistants required',
        });
        break;

      case 'Stunt Coordination':
        drivers.push({
          category: 'Specialized Personnel',
          impact: 'Professional stunt coordinators and performers command premium rates',
        });
        drivers.push({
          category: 'Safety & Insurance',
          impact: 'Higher insurance premiums and safety equipment costs',
        });
        break;

      case 'Vehicle Operations':
        drivers.push({
          category: 'Equipment & Permits',
          impact: 'Vehicle rentals, insurance, and location permits increase budget',
        });
        if (signal.level === 'High') {
          drivers.push({
            category: 'Precision Drivers',
            impact: 'Specialized stunt drivers required for high-speed sequences',
          });
        }
        break;

      case 'Action Intensity':
        if (signal.level === 'High') {
          drivers.push({
            category: 'Extended Filming Time',
            impact: 'Complex choreography requires additional shooting days',
          });
          drivers.push({
            category: 'Rehearsal Costs',
            impact: 'Pre-production rehearsal time increases labor costs',
          });
        }
        break;

      case 'Environment Complexity':
        if (signal.level === 'High') {
          drivers.push({
            category: 'Art Department',
            impact: 'Complex set design and construction increases production design budget',
          });
          drivers.push({
            category: 'Setup Time',
            impact: 'Additional prep days required for detailed environments',
          });
        } else if (signal.level === 'Medium') {
          drivers.push({
            category: 'Art Department',
            impact: 'Moderate set dressing and props budget required',
          });
        }
        break;

      case 'Weather Dependency':
        drivers.push({
          category: 'Schedule Contingency',
          impact: 'Weather delays may require buffer days and crew overtime',
        });
        drivers.push({
          category: 'Backup Plans',
          impact: 'Alternative indoor locations may need to be secured',
        });
        break;

      case 'Night Shooting':
        drivers.push({
          category: 'Lighting Equipment',
          impact: 'Additional lighting gear and generators required for night shoots',
        });
        drivers.push({
          category: 'Crew Overtime',
          impact: 'Night differential pay increases labor costs',
        });
        break;
    }
  });

  // === CATEGORY-SPECIFIC DRIVERS ===
  if (sceneCategory === 'VFX') {
    drivers.push({
      category: 'Post-Production VFX',
      impact: 'VFX-heavy scenes require dedicated post-production budget',
    });
  }

  // === INCORPORATE USER-PROVIDED COST INPUTS ===
  if (costInputs) {
    // Extras Range
    if (costInputs.extrasRange === 'large') {
      drivers.push({
        category: 'Large Cast',
        impact: '50+ extras significantly increase casting, wardrobe, and catering costs',
      });
    } else if (costInputs.extrasRange === 'medium') {
      drivers.push({
        category: 'Moderate Cast',
        impact: '10-50 extras require additional coordination and support staff',
      });
    }

    // Controlled Set
    if (costInputs.controlledSet === false) {
      drivers.push({
        category: 'Location Permits',
        impact: 'Non-controlled locations require permits, security, and public coordination',
      });
    }

    // Schedule Flexibility
    if (costInputs.scheduleFlexibility === false) {
      drivers.push({
        category: 'Fixed Schedule',
        impact: 'Inflexible schedule limits ability to optimize for weather and availability',
      });
    }

    // Location Complexity
    if (costInputs.locationComplexity === 'remote') {
      drivers.push({
        category: 'Remote Location',
        impact: 'Remote shoots require travel, accommodation, and equipment transport',
      });
    } else if (costInputs.locationComplexity === 'studio') {
      drivers.push({
        category: 'Studio Rental',
        impact: 'Studio space rental and associated facility costs',
      });
    }

    // Union Crew
    if (costInputs.unionCrew === true) {
      drivers.push({
        category: 'Union Labor',
        impact: 'Union crew rates and regulations increase labor costs',
      });
    }
  }

  // === DETERMINE COST PRESSURE (DETERMINISTIC LOGIC) ===
  const highRiskCount = riskSignals.filter((s) => s.level === 'High').length;
  const mediumRiskCount = riskSignals.filter((s) => s.level === 'Medium').length;

  // Adjust pressure based on cost inputs
  let pressureModifier = 0;
  if (costInputs) {
    if (costInputs.extrasRange === 'large') pressureModifier += 1;
    if (costInputs.extrasRange === 'medium') pressureModifier += 0.5;
    if (costInputs.controlledSet === false) pressureModifier += 0.5;
    if (costInputs.scheduleFlexibility === false) pressureModifier += 0.5;
    if (costInputs.locationComplexity === 'remote') pressureModifier += 1;
    if (costInputs.locationComplexity === 'studio') pressureModifier += 0.5;
    if (costInputs.unionCrew === true) pressureModifier += 0.5;
  }

  let costPressure: CostPressure;

  if (highRiskCount >= 2 || (highRiskCount >= 1 && multiplier > 1.0) || pressureModifier >= 2) {
    costPressure = 'High';
  } else if (highRiskCount === 1 || mediumRiskCount >= 2 || pressureModifier >= 1) {
    costPressure = 'Medium';
  } else {
    costPressure = 'Low';
  }

  // === BUDGET CONSTRAINT AS MODIFIER ===
  // Budget constraint affects explanation severity, not the detected pressure/drivers
  const budgetContext = costInputs?.budgetConstraint;
  
  // === GENERATE EXPLANATION ===
  let explanation = '';
  
  // Add budget context if specified
  if (budgetContext && budgetContext !== 'not_specified') {
    if (budgetContext === 'highly_constrained') {
      explanation += 'Under a highly constrained budget scenario: ';
    } else if (budgetContext === 'moderately_constrained') {
      explanation += 'Under a moderately constrained budget: ';
    } else if (budgetContext === 'flexible') {
      explanation += 'With flexible budget allocation: ';
    }
  }
  
  explanation += `Cost pressure is ${costPressure.toLowerCase()} based on ${drivers.length} identified cost driver${drivers.length !== 1 ? 's' : ''}.`;

  if (costPressure === 'High') {
    if (budgetContext === 'highly_constrained') {
      explanation +=
        ' Multiple high-impact factors combined with tight budget constraints create significant feasibility concerns. Strong cost mitigation strategies are critical.';
    } else if (budgetContext === 'flexible') {
      explanation +=
        ' Multiple high-impact factors will increase production budget, though flexible allocation provides room for optimization.';
    } else {
      explanation +=
        ' Multiple high-impact factors will significantly increase production budget. Consider prioritizing essential elements and exploring cost-effective alternatives.';
    }
  } else if (costPressure === 'Medium') {
    if (budgetContext === 'highly_constrained') {
      explanation +=
        ' Moderate cost drivers under constrained budget require careful planning and potential scope adjustments.';
    } else if (budgetContext === 'flexible') {
      explanation +=
        ' Moderate budget increase manageable with flexible allocation. Focus on quality optimization.';
    } else {
      explanation +=
        ' Moderate budget increase expected. Careful planning can help manage costs while maintaining production quality.';
    }
  } else {
    if (budgetContext === 'highly_constrained') {
      explanation +=
        ' Standard costs fit well within constrained budget parameters.';
    } else if (budgetContext === 'flexible') {
      explanation +=
        ' Standard production costs with room for quality enhancements given flexible budget.';
    } else {
      explanation +=
        ' Standard production costs anticipated. Scene can be executed within typical budget parameters.';
    }
  }

  return {
    costPressure,
    drivers,
    explanation,
  };
}
