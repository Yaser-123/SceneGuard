import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Shield,
  Wrench,
  DollarSign,
  MapPin,
} from 'lucide-react';
import type { SceneAnalysisResponse } from '@/lib/types';
import PlanningWarnings from './planning-warnings';
import ProductionChecklist from './production-checklist';
import { getFeasibilityColor, getFeasibilityBgColor } from '@/lib/feasibility-score';

// ===========================
// RESULTS VIEW - PPT LAYOUT
// ===========================
// Displays analysis results exactly as shown in PPT

interface ResultsViewProps {
  analysis: SceneAnalysisResponse;
}

export default function ResultsView({ analysis }: ResultsViewProps) {
  const feasibility = analysis.constraintIntelligence.feasibilityScore;
  const constraints = analysis.constraintIntelligence.constraints;

  // Extract scene metadata for components
  const sceneMetadata = {
    category: analysis.sceneMetadata.category,
    timeOfDay: analysis.sceneMetadata.timeOfDay,
    hasStunts: analysis.geminiParsing.hasStunts,
    hasCrowd: analysis.geminiParsing.hasCrowd,
    hasVehicles: analysis.geminiParsing.hasVehicles,
  };

  return (
    <div className="space-y-6">
      {/* FEASIBILITY SCORE - HERO SECTION */}
      <Card className={`w-full border-2 ${getFeasibilityBgColor(feasibility.level)}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-background/50">
              {feasibility.level === 'Low Risk' ? (
                <CheckCircle2 className={`h-8 w-8 ${getFeasibilityColor(feasibility.level)}`} />
              ) : (
                <AlertTriangle className={`h-8 w-8 ${getFeasibilityColor(feasibility.level)}`} />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">Feasibility Score</div>
              <div className={`text-3xl font-bold ${getFeasibilityColor(feasibility.level)}`}>
                {feasibility.level}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Production Readiness</div>
              <div className={`text-2xl font-bold ${getFeasibilityColor(feasibility.level)}`}>
                {feasibility.score}/100
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{feasibility.explanation}</p>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground italic">
              Quantifiable assessment of scene complexity and production readiness grounded in
              explicit scene evidence.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* RISK CATEGORIES - FROM PPT */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neutral-200">
            <TrendingUp className="h-5 w-5" />
            Risk Categories
          </CardTitle>
          <p className="text-sm text-neutral-400 mt-2">
            Production constraints identified across four categories
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* High Priority Count */}
            <Card className="bg-neutral-800 border-red-500 border-l-4">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {feasibility.highRiskCount}
                    </div>
                    <div className="text-sm text-red-300">High Priority</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medium Priority Count */}
            <Card className="bg-neutral-800 border-yellow-500 border-l-4">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {feasibility.mediumRiskCount}
                    </div>
                    <div className="text-sm text-yellow-300">
                      Medium Priority
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Category Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Budget */}
            <Card className="bg-neutral-800 border-neutral-700 border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-neutral-100">Budget</h4>
                      <Badge
                        variant="outline"
                        className={
                          constraints.budget.level === 'High'
                            ? 'bg-red-500/20 text-red-400'
                            : constraints.budget.level === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }
                      >
                        {constraints.budget.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {constraints.budget.reasoning}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logistics */}
            <Card className="bg-neutral-800 border-neutral-700 border-l-4 border-l-purple-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-neutral-100">Logistics</h4>
                      <Badge
                        variant="outline"
                        className={
                          constraints.logistics.level === 'High'
                            ? 'bg-red-500/20 text-red-400'
                            : constraints.logistics.level === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }
                      >
                        {constraints.logistics.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {constraints.logistics.reasoning}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety */}
            <Card className="bg-neutral-800 border-neutral-700 border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-neutral-100">Safety</h4>
                      <Badge
                        variant="outline"
                        className={
                          constraints.safety.level === 'High'
                            ? 'bg-red-500/20 text-red-400'
                            : constraints.safety.level === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }
                      >
                        {constraints.safety.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {constraints.safety.reasoning}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical */}
            <Card className="bg-neutral-800 border-neutral-700 border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Wrench className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-neutral-100">Technical</h4>
                      <Badge
                        variant="outline"
                        className={
                          constraints.technical.level === 'High'
                            ? 'bg-red-500/20 text-red-400'
                            : constraints.technical.level === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }
                      >
                        {constraints.technical.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {constraints.technical.reasoning}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground italic text-center">
              Each risk flag includes an AI-generated explanation describing why the scene is
              classified as Low, Medium, or High risk.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* PLANNING WARNINGS */}
      <PlanningWarnings
        constraints={constraints}
        sceneMetadata={sceneMetadata}
        weatherFeasibility={analysis.weatherFeasibility}
      />

      {/* MITIGATION STEPS */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neutral-200">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            Mitigation Steps
          </CardTitle>
          <p className="text-sm text-neutral-400 mt-2">
            Actionable recommendations to reduce risk before production begins
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(() => {
              // Extract ALL mitigation steps from risk signals (fact-based)
              const allMitigations: string[] = [];
              
              if (analysis.constraintIntelligence?.riskSignals) {
                analysis.constraintIntelligence.riskSignals.forEach(signal => {
                  signal.mitigationSteps?.forEach(step => {
                    if (!allMitigations.includes(step)) {
                      allMitigations.push(step);
                    }
                  });
                });
              }

              // Fallback to old planning insights if new system not available
              if (allMitigations.length === 0 && analysis.planningInsights?.mitigationStrategies) {
                allMitigations.push(...analysis.planningInsights.mitigationStrategies);
              }

              return allMitigations.length > 0 ? (
                allMitigations.map((mitigation, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-green-900 dark:text-green-100">{mitigation}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    No specific mitigation steps required. Standard production protocols apply.
                  </p>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* PRODUCTION CHECKLIST */}
      <ProductionChecklist constraints={constraints} sceneMetadata={sceneMetadata} />
    </div>
  );
}
