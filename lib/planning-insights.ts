import { WeatherFeasibility } from './weather-service';
import { RiskAnalysisResult } from './risk-analyzer';
import { CostImpactResult } from './cost-analyzer';

export interface PlanningInsights {
  locationGuidance?: string;
  weatherPattern?: string;
  productionRecommendation: string;
  recommendations: string[];
  mitigationStrategies: string[];
  alternativeApproaches?: string[];
  logistics?: string; // Added logistics property
}

/**
 * PLANNING INSIGHTS GENERATOR (TEMPLATED LOGIC)
 * Generates text sections using deterministic templates
 */
export function generatePlanningInsights(
  sceneCategory: 'Indoor' | 'Outdoor' | 'VFX',
  weather: WeatherFeasibility,
  timeOfDay?: 'Day' | 'Night',
  riskAnalysis?: RiskAnalysisResult,
  costImpact?: CostImpactResult
): PlanningInsights {
  const insights: PlanningInsights = {
    productionRecommendation: '',
    recommendations: [],
    mitigationStrategies: [],
  };

  // === GENERATE RECOMMENDATIONS ===
  if (riskAnalysis && riskAnalysis.signals.length > 0) {
    // Recommendations based on risk signals
    const highRisks = riskAnalysis.signals.filter(s => s.level === 'High');
    const mediumRisks = riskAnalysis.signals.filter(s => s.level === 'Medium');

    if (highRisks.length > 0) {
      insights.recommendations.push('Schedule additional pre-production meetings with department heads to address high-risk elements');
      insights.recommendations.push('Allocate extra prep days for crew coordination and safety briefings');
    }

    if (riskAnalysis && riskAnalysis.signals.length > 0) {
      const highRisks = riskAnalysis.signals.filter(s => s.level === 'High');

      if (highRisks.length > 1) {
        insights.recommendations.push('Consider breaking scene into multiple shooting days to reduce complexity');
        insights.recommendations.push('Engage specialized coordinators early in pre-production phase');
      }
    }

    if (highRisks.some(r => r.name.includes('Stunt'))) {
      insights.recommendations.push('Hire certified stunt coordinator at least 4 weeks before shoot date');
    }

    if (highRisks.some(r => r.name.includes('Crowd'))) {
      insights.recommendations.push('Recruit experienced assistant directors for crowd management');
      insights.recommendations.push('Schedule extra background talent coordinators');
    }

    if (mediumRisks.length > 0) {
      insights.recommendations.push('Build buffer time into shooting schedule for unexpected delays');
    }
  }

  if (costImpact && costImpact.costPressure === 'High') {
    insights.recommendations.push('Review script with producer to identify potential cost-saving alternatives');
    insights.recommendations.push('Obtain multiple vendor quotes for specialized equipment and services');
  }

  if (sceneCategory === 'Outdoor' && weather.applicable) {
    insights.recommendations.push('Monitor weather forecasts 7 days before shoot and have indoor backup plan ready');
    if (weather.averageRainDays && weather.averageRainDays > 5) {
      insights.recommendations.push('Schedule weather cover day and prepare alternative interior shots');
    }
  }

  // === GENERATE MITIGATION STRATEGIES ===
  // NOTE: This function receives OLD risk analyzer output.
  // Mitigation steps now come from the NEW risk engine's RiskSignal.mitigationSteps.
  // This section only adds GENERIC cross-cutting mitigations.
  if (riskAnalysis && riskAnalysis.signals.length > 0) {
    const highRisks = riskAnalysis.signals.filter(s => s.level === 'High');

    // Weather mitigations - ONLY if weather risk exists
    // (This should rarely trigger since new risk engine handles mitigations)

    if (highRisks.some(r => r.name.includes('Stunt'))) {
      insights.mitigationStrategies.push('Conduct full stunt rehearsals with safety team before filming');
      insights.mitigationStrategies.push('Have on-set medical personnel during all stunt sequences');
    }

    if (highRisks.some(r => r.name.includes('Crowd'))) {
      insights.mitigationStrategies.push('Establish clear communication protocols with background talent');
      insights.mitigationStrategies.push('Create detailed crowd movement choreography with visual diagrams');
    }

    if (highRisks.some(r => r.name.includes('Vehicle'))) {
      insights.mitigationStrategies.push('Hire precision drivers and conduct vehicle safety inspections');
      insights.mitigationStrategies.push('Coordinate with local authorities for road closures and traffic control');
    }

    if (highRisks.some(r => r.name.includes('Night'))) {
      insights.mitigationStrategies.push('Plan crew rest periods and limit consecutive night shoots');
      insights.mitigationStrategies.push('Arrange transportation for crew safety during night hours');
    }

    if (highRisks.some(r => r.name.includes('Environment Complexity'))) {
      insights.mitigationStrategies.push('Allocate extra construction and set dressing time');
      insights.mitigationStrategies.push('Create detailed set design mockups before build begins');
    }
  }

  // Cost pressure mitigations now handled by risk engine signals
  // Only add if extremely high cost pressure and not already covered
  if (costImpact && costImpact.costPressure === 'High' && insights.mitigationStrategies.length === 0) {
    insights.mitigationStrategies.push('Review budget allocation with line producer');
  }

  if (sceneCategory === 'Outdoor' && timeOfDay === 'Night') {
    insights.mitigationStrategies.push('Rent high-efficiency LED lighting to reduce power and setup time');
  }

  // No default mitigations - let risk engine signals provide ALL mitigations
  // Empty mitigation list means scene is straightforward

  // === LOCATION GUIDANCE ===
  if (sceneCategory === 'Outdoor' && weather.applicable && weather.location) {
    insights.locationGuidance = `Filming in ${weather.location} requires scouting locations with reliable access to power, parking, and crew facilities. Ensure permits are secured well in advance and local regulations are reviewed.`;
  } else if (sceneCategory === 'Indoor') {
    insights.locationGuidance =
      'Indoor scenes offer controlled environment benefits. Prioritize sound stages or locations with reliable power and climate control. Verify ceiling height for lighting rigs.';
  } else if (sceneCategory === 'VFX') {
    insights.locationGuidance =
      'VFX scenes benefit from studio environments with green screen capabilities. Ensure adequate space for camera movement and consistent lighting control.';
  }

  // === WEATHER PATTERN ===
  if (sceneCategory === 'Outdoor' && weather.applicable && weather.month) {
    const rainDays = weather.averageRainDays || 0;
    const windSpeed = weather.averageWindSpeed || 0;

    insights.weatherPattern = `Historical data for ${weather.month} in ${weather.location} shows approximately ${rainDays} rainy days in the first half of the month, with average wind speeds of ${windSpeed} mph. `;

    if (rainDays > 5) {
      insights.weatherPattern +=
        'High precipitation probability - schedule critical shots early in production window.';
    } else if (rainDays > 2) {
      insights.weatherPattern += 'Moderate weather variability - maintain flexible shot list.';
    } else {
      insights.weatherPattern += 'Generally favorable conditions for outdoor filming.';
    }
  }

  // === PRODUCTION RECOMMENDATION ===
  if (sceneCategory === 'Outdoor') {
    if (timeOfDay === 'Night') {
      insights.productionRecommendation =
        'Night outdoor shoot: Schedule crew call times to maximize golden hour and night filming windows. Budget for substantial lighting equipment. Plan for crew fatigue with adequate breaks. Have backup indoor options ready in case of weather.';
    } else {
      insights.productionRecommendation =
        'Day outdoor shoot: Take advantage of natural lighting but have diffusion and bounce equipment ready. Monitor weather forecasts daily and maintain communication with backup locations. Schedule scenes requiring consistent lighting consecutively.';
    }
  } else if (sceneCategory === 'Indoor') {
    if (timeOfDay === 'Night') {
      insights.productionRecommendation =
        'Indoor night scene: Full lighting control allows for precise mood creation. Plan lighting setup time into schedule. Consider practical lights in frame for added realism. No weather concerns simplify scheduling.';
    } else {
      insights.productionRecommendation =
        'Indoor day scene: Utilize available practical windows but maintain control with lighting supplements. Easier scheduling flexibility without weather dependencies. Focus on sound isolation and art department details.';
    }
  } else if (sceneCategory === 'VFX') {
    insights.productionRecommendation =
      'VFX-driven scene: Studio control eliminates weather variables. Allocate time for VFX supervisor on-set oversight. Shoot clean plates and tracking markers. Plan post-production pipeline early. Time of day can be created in post, offering maximum flexibility.';
  }

  return insights;
}
