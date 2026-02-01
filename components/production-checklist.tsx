import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

// ===========================
// PRODUCTION CHECKLIST
// ===========================
// Shows which pre-production checklist items are impacted by the scene

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  impacted: boolean;
  reason?: string;
}

interface ProductionChecklistProps {
  constraints: {
    budget: { level: 'Low' | 'Medium' | 'High' };
    logistics: { level: 'Low' | 'Medium' | 'High' };
    safety: { level: 'Low' | 'Medium' | 'High' };
    technical: { level: 'Low' | 'Medium' | 'High' };
  };
  sceneMetadata: {
    category: string;
    hasStunts?: boolean;
    hasCrowd?: boolean;
    hasVehicles?: boolean;
  };
}

/**
 * Determines which checklist items are impacted based on constraints
 */
function getImpactedChecklistItems(
  constraints: ProductionChecklistProps['constraints'],
  sceneMetadata: ProductionChecklistProps['sceneMetadata']
): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // ONLY show items that THIS SCENE impacts
  // Remove generic/always-show items

  // Budget - only if Medium or High constraint
  if (constraints.budget.level !== 'Low') {
    items.push({
      id: 'budget',
      title: 'Finalize the Budget',
      description: 'Allocate costs for cast, crew, locations, equipment, post-production',
      impacted: true,
      reason: `Budget constraint level: ${constraints.budget.level}`,
    });
  }

  // Financing - only if HIGH budget pressure
  if (constraints.budget.level === 'High') {
    items.push({
      id: 'financing',
      title: 'Secure Financing / Business Planning',
      description: 'Lock funding sources, production scale, and financial approvals',
      impacted: true,
      reason: 'High budget pressure requires financial planning',
    });
  }

  // Production heads - only if technical complexity
  if (constraints.technical.level !== 'Low') {
    items.push({
      id: 'production-heads',
      title: 'Hire Key Production Heads',
      description: 'Director of Photography, Production Designer, Assistant Director, Line Producer',
      impacted: true,
      reason: `Technical complexity requires specialized crew: ${constraints.technical.level}`,
    });
  }

  // Storyboards - only if HIGH technical complexity
  if (constraints.technical.level === 'High') {
    items.push({
      id: 'storyboards',
      title: 'Create Storyboards & Shot Lists',
      description: 'Visualize scenes to understand technical and logistical complexity',
      impacted: true,
      reason: 'High technical complexity needs detailed shot planning',
    });
  }

  // Locations - only if logistics constraint exists
  if (constraints.logistics.level !== 'Low') {
    items.push({
      id: 'locations',
      title: 'Scout & Secure Locations',
      description: 'Permissions, accessibility, power, weather risks, crowd control',
      impacted: true,
      reason: `Logistics constraint level: ${constraints.logistics.level}`,
    });
  }

  // Cast talent - only if crowd or HIGH logistics
  if (sceneMetadata.hasCrowd || constraints.logistics.level === 'High') {
    items.push({
      id: 'cast-talent',
      title: 'Cast Talent',
      description: 'Main cast, supporting roles, extras, availability and contracts',
      impacted: true,
      reason: sceneMetadata.hasCrowd
        ? 'Scene requires crowd/extras coordination'
        : 'High logistics complexity affects talent scheduling',
    });
  }

  // Art department - only if technical complexity OR stunts
  if (constraints.technical.level !== 'Low' || sceneMetadata.hasStunts === true) {
    items.push({
      id: 'art-department',
      title: 'Prepare Art Department',
      description: 'Sets, props, costumes, makeup, stunts, equipment insurance',
      impacted: true,
      reason: sceneMetadata.hasStunts
        ? 'Scene involves stunts requiring special preparation'
        : `Technical requirements: ${constraints.technical.level}`,
    });
  }

  // Permits & Insurance - ONLY if stunts, vehicles, OR large crowd in public space
  // FIXED: Medium safety level alone does NOT trigger permits
  if (
    sceneMetadata.hasStunts === true ||
    sceneMetadata.hasVehicles === true ||
    (sceneMetadata.hasCrowd && constraints.logistics.level === 'High')
  ) {
    items.push({
      id: 'permits-insurance',
      title: 'Arrange Permits & Insurance',
      description: 'Shooting permits, public liability, stunts, equipment insurance',
      impacted: true,
      reason:
        sceneMetadata.hasStunts || sceneMetadata.hasVehicles
          ? '⚠ Stunts or vehicles require special permits and insurance'
          : 'Large crowd in public space requires permits',
    });
  }

  // Schedule - only if HIGH logistics complexity
  if (constraints.logistics.level === 'High') {
    items.push({
      id: 'schedule-shoot',
      title: 'Schedule Your Shoot',
      description: 'Day-by-day calendar, crew call times, and location logistics',
      impacted: true,
      reason: 'High logistics complexity requires detailed scheduling',
    });
  }

  return items;
}

export default function ProductionChecklist({
  constraints,
  sceneMetadata,
}: ProductionChecklistProps) {
  const checklistItems = getImpactedChecklistItems(constraints, sceneMetadata);
  const impactedCount = checklistItems.filter((item) => item.impacted).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Production Checklist</CardTitle>
          <Badge variant="outline">
            {impactedCount} item{impactedCount !== 1 ? 's' : ''} affected
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Standard pre-production tasks impacted by this scene
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {checklistItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                item.impacted
                  ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900'
                  : 'bg-muted/50 border-muted'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {item.impacted ? (
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                {item.impacted && item.reason && (
                  <div className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                    ⚠ {item.reason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
