"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, Shield, Wrench, DollarSign, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ConstraintData {
  level: 'Low' | 'Medium' | 'High';
  score: number;
  explanation: string;
  primaryDrivers?: string[];
  primaryBottlenecks?: string[];
  safetyConcerns?: string[];
  technicalChallenges?: string[];
  suggestions?: string[];
}

interface ConstraintsBreakdownProps {
  constraints: {
    budget: ConstraintData;
    logistics: ConstraintData;
    safety: ConstraintData;
    technical: ConstraintData;
  };
}

const COLORS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#ef4444',
};

const ICONS = {
  budget: DollarSign,
  logistics: MapPin,
  safety: Shield,
  technical: Wrench,
};

function getLevelColor(level: 'Low' | 'Medium' | 'High'): string {
  return COLORS[level];
}

function getProgressValue(score: number): number {
  return (score / 10) * 100;
}

export function ConstraintsBreakdown({ constraints }: ConstraintsBreakdownProps) {
  const [expanded, setExpanded] = useState(true);
  const [activeConstraint, setActiveConstraint] = useState<'budget' | 'logistics' | 'safety' | 'technical' | null>(null);

  // Prepare pie chart data
  const pieData = [
    { name: 'Budget', value: constraints.budget.score, level: constraints.budget.level },
    { name: 'Logistics', value: constraints.logistics.score, level: constraints.logistics.level },
    { name: 'Safety', value: constraints.safety.score, level: constraints.safety.level },
    { name: 'Technical', value: constraints.technical.score, level: constraints.technical.level },
  ];

  const constraintEntries: Array<{ key: 'budget' | 'logistics' | 'safety' | 'technical'; label: string; data: ConstraintData }> = [
    { key: 'budget', label: 'Budget', data: constraints.budget },
    { key: 'logistics', label: 'Logistics', data: constraints.logistics },
    { key: 'safety', label: 'Safety', data: constraints.safety },
    { key: 'technical', label: 'Technical', data: constraints.technical },
  ];

  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader 
        className="pb-3 border-b border-neutral-700 cursor-pointer hover:bg-neutral-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-400" />
            PRODUCTION CONSTRAINT BREAKDOWN
          </CardTitle>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          )}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-6 space-y-6">
          {/* Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Constraint Levels Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Constraint Levels</h3>
              {constraintEntries.map(({ key, label, data }) => {
                const Icon = ICONS[key];
                return (
                  <div
                    key={key}
                    className={`p-3 rounded border transition-all cursor-pointer ${
                      activeConstraint === key
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                    }`}
                    onClick={() => setActiveConstraint(activeConstraint === key ? null : key)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-medium text-white">{label}</span>
                      </div>
                      <Badge
                        style={{ backgroundColor: getLevelColor(data.level), color: '#fff' }}
                        className="text-xs font-semibold"
                      >
                        {data.level}
                      </Badge>
                    </div>
                    <Progress
                      value={getProgressValue(data.score)}
                      className="h-2"
                      style={{
                        backgroundColor: '#262626',
                      }}
                    />
                    <div className="mt-1 text-xs text-neutral-500">
                      Score: {data.score}/10
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pie Chart */}
            <div className="flex flex-col">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Constraint Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getLevelColor(entry.level)} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171717',
                      border: '1px solid #404040',
                      borderRadius: '6px',
                      color: '#fff',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#fff' }}
                    formatter={(value) => <span style={{ color: '#a3a3a3' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed View */}
          {activeConstraint && (
            <div className="border border-blue-500/30 bg-blue-500/5 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 border-b border-blue-500/20 pb-2">
                {(() => {
                  const Icon = ICONS[activeConstraint];
                  return <Icon className="w-5 h-5 text-blue-400" />;
                })()}
                <h3 className="text-lg font-semibold text-white capitalize">{activeConstraint} Constraint</h3>
                <Badge
                  style={{ backgroundColor: getLevelColor(constraints[activeConstraint].level), color: '#fff' }}
                  className="ml-auto"
                >
                  {constraints[activeConstraint].level}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase mb-1">Explanation</h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {constraints[activeConstraint].explanation}
                  </p>
                </div>

                {(constraints[activeConstraint].primaryDrivers ||
                  constraints[activeConstraint].primaryBottlenecks ||
                  constraints[activeConstraint].safetyConcerns ||
                  constraints[activeConstraint].technicalChallenges) && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase mb-2">
                      {activeConstraint === 'budget' && 'Primary Drivers'}
                      {activeConstraint === 'logistics' && 'Primary Bottlenecks'}
                      {activeConstraint === 'safety' && 'Safety Concerns'}
                      {activeConstraint === 'technical' && 'Technical Challenges'}
                    </h4>
                    <ul className="space-y-1">
                      {(constraints[activeConstraint].primaryDrivers ||
                        constraints[activeConstraint].primaryBottlenecks ||
                        constraints[activeConstraint].safetyConcerns ||
                        constraints[activeConstraint].technicalChallenges || []).map((item, idx) => (
                        <li key={idx} className="text-sm text-neutral-400 flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {constraints[activeConstraint].suggestions && constraints[activeConstraint].suggestions!.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-green-400 uppercase mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Mitigation Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {constraints[activeConstraint].suggestions!.map((suggestion, idx) => (
                        <li key={idx} className="text-sm text-green-200 bg-green-500/10 border border-green-500/20 rounded p-2">
                          → {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {!activeConstraint && (
            <div className="text-center text-sm text-neutral-500 py-4 border border-dashed border-neutral-700 rounded">
              Click on a constraint above to view detailed analysis and mitigation suggestions
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
