import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, DollarSign, Users, Shield } from 'lucide-react';

// ===========================
// PLANNING WARNINGS
// ===========================
// Early alerts for scheduling conflicts, budget implications, and resource gaps

export type WarningType = 'schedule' | 'budget' | 'resource' | 'safety';

export interface PlanningWarning {
  type: WarningType;
  title: string;
  description: string;
  severity: 'high' | 'medium';
}

interface PlanningWarningsProps {
  constraints: {
    budget: { level: 'Low' | 'Medium' | 'High'; reasoning: string };
    logistics: { level: 'Low' | 'Medium' | 'High'; reasoning: string };
    safety: { level: 'Low' | 'Medium' | 'High'; reasoning: string };
    technical: { level: 'Low' | 'Medium' | 'High'; reasoning: string };
  };
  sceneMetadata: {
    category: string;
    timeOfDay?: string;
    hasStunts?: boolean;
    hasCrowd?: boolean;
    hasVehicles?: boolean;
  };
  weatherFeasibility?: {
    applicable: boolean;
    feasibility?: string;
  };
}

/**
 * Generates planning warnings from constraint analysis
 */
function generatePlanningWarnings(
  constraints: PlanningWarningsProps['constraints'],
  sceneMetadata: PlanningWarningsProps['sceneMetadata'],
  weatherFeasibility?: PlanningWarningsProps['weatherFeasibility']
): PlanningWarning[] {
  const warnings: PlanningWarning[] = [];

  // SCHEDULE IMPACT WARNINGS
  if (constraints.logistics.level === 'High') {
    warnings.push({
      type: 'schedule',
      title: 'Schedule Impact',
      description:
        'High logistics complexity may cause scheduling delays. Complex coordination required for location access, crew availability, and equipment setup.',
      severity: 'high',
    });
  } else if (constraints.logistics.level === 'Medium' && sceneMetadata.timeOfDay === 'Night') {
    warnings.push({
      type: 'schedule',
      title: 'Schedule Impact',
      description:
        'Night shooting combined with moderate logistics creates scheduling pressure. Limited work hours and crew fatigue must be factored into timeline.',
      severity: 'medium',
    });
  } else if (
    weatherFeasibility?.applicable &&
    weatherFeasibility?.feasibility &&
    weatherFeasibility.feasibility !== 'Good'
  ) {
    warnings.push({
      type: 'schedule',
      title: 'Schedule Impact',
      description:
        'Weather-dependent outdoor scene requires flexible scheduling. Weather delays are probable and should be planned for with backup dates.',
      severity: 'medium',
    });
  }

  // BUDGET PRESSURE WARNINGS
  if (constraints.budget.level === 'High') {
    warnings.push({
      type: 'budget',
      title: 'Budget Alert',
      description:
        'High budget pressure flagged. Scene requires significant resource allocation across multiple departments. Cost-benefit analysis recommended.',
      severity: 'high',
    });
  } else if (constraints.budget.level === 'Medium' && constraints.safety.level !== 'Low') {
    warnings.push({
      type: 'budget',
      title: 'Budget Alert',
      description:
        'Safety requirements amplify budget constraints. Specialized safety equipment and personnel are non-negotiable expenses that limit budget flexibility.',
      severity: 'medium',
    });
  }

  // RESOURCE GAP WARNINGS
  if (constraints.technical.level === 'High' && constraints.logistics.level !== 'Low') {
    warnings.push({
      type: 'resource',
      title: 'Resource Gap',
      description:
        'High technical complexity combined with logistics challenges. Specialized crew and equipment must be secured early to avoid production bottlenecks.',
      severity: 'high',
    });
  } else if (sceneMetadata.hasCrowd && constraints.logistics.level !== 'Low') {
    warnings.push({
      type: 'resource',
      title: 'Resource Gap',
      description:
        'Crowd scenes require extensive coordination resources. Additional assistant directors, production assistants, and crowd wranglers needed.',
      severity: 'medium',
    });
  } else if (constraints.technical.level === 'High') {
    warnings.push({
      type: 'resource',
      title: 'Resource Gap',
      description:
        'Specialized technical expertise required. Confirm availability of qualified crew for complex equipment operation and setup.',
      severity: 'medium',
    });
  }

  // SAFETY OVERSIGHT WARNINGS
  if (constraints.safety.level === 'High') {
    warnings.push({
      type: 'safety',
      title: 'Safety Oversight Risk',
      description:
        'Critical safety protocols required. Certified safety coordinator must be on set. Insurance and permits must be secured before production begins.',
      severity: 'high',
    });
  } else if (
    constraints.safety.level === 'Medium' &&
    (sceneMetadata.hasStunts || sceneMetadata.hasVehicles)
  ) {
    warnings.push({
      type: 'safety',
      title: 'Safety Oversight Risk',
      description:
        'Stunts or vehicles detected with moderate safety concerns. Professional stunt coordinator and medical personnel should be on standby.',
      severity: 'medium',
    });
  }

  return warnings;
}

const WARNING_ICONS = {
  schedule: Calendar,
  budget: DollarSign,
  resource: Users,
  safety: Shield,
};

const SEVERITY_COLORS = {
  high: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-900 dark:text-red-100',
  medium:
    'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900 text-yellow-900 dark:text-yellow-100',
};

export default function PlanningWarnings({
  constraints,
  sceneMetadata,
  weatherFeasibility,
}: PlanningWarningsProps) {
  const warnings = generatePlanningWarnings(constraints, sceneMetadata, weatherFeasibility);

  if (warnings.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600 dark:text-green-400" />
            Planning Warnings
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Early alerts for scheduling conflicts, budget implications, and resource gaps
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              No critical warnings detected. Scene appears production-ready with standard
              preparations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const highSeverityCount = warnings.filter((w) => w.severity === 'high').length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            Planning Warnings
          </CardTitle>
          {highSeverityCount > 0 && (
            <Badge variant="destructive">{highSeverityCount} High Priority</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Early alerts for scheduling conflicts, budget implications, and resource gaps
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warnings.map((warning, idx) => {
            const Icon = WARNING_ICONS[warning.type];
            return (
              <Card key={idx} className={`border ${SEVERITY_COLORS[warning.severity]}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{warning.title}</h4>
                        {warning.severity === 'high' && (
                          <Badge variant="outline" className="text-xs">
                            High
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed">{warning.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
