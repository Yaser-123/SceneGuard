"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Info, Shield, CheckCircle2, AlertTriangle } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"

export default function CostImpactPage() {
  const { analysis } = useAnalysis()

  const getCostPressureColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getCostBadgeColor = (level: string) => {
    const lowerLevel = level?.toLowerCase() || ''
    if (lowerLevel.includes('high') || lowerLevel.includes('critical')) {
      return "bg-red-500/20 text-red-400"
    } else if (lowerLevel.includes('medium') || lowerLevel.includes('moderate')) {
      return "bg-yellow-500/20 text-yellow-400"
    } else if (lowerLevel.includes('low') || lowerLevel.includes('minimal')) {
      return "bg-green-500/20 text-green-400"
    }
    return "bg-neutral-500/20 text-neutral-400"
  }

  const getConstraintColor = (level: string) => {
    const lowerLevel = level?.toLowerCase() || ''
    if (lowerLevel.includes('high') || lowerLevel.includes('strict')) {
      return "bg-red-500/20 text-red-400"
    } else if (lowerLevel.includes('medium') || lowerLevel.includes('moderate')) {
      return "bg-yellow-500/20 text-yellow-400"
    } else if (lowerLevel.includes('low') || lowerLevel.includes('flexible')) {
      return "bg-green-500/20 text-green-400"
    }
    return "bg-blue-500/20 text-blue-400"
  }

  if (!analysis) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider mb-1">COST IMPACT ANALYSIS</h1>
          <p className="text-sm text-neutral-400">AI-Generated Production Budget Assessment</p>
        </div>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Info className="w-12 h-12 text-neutral-600 mb-4" />
            <p className="text-neutral-400 text-sm">
              No scene analysis available. Please analyze a scene first.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Use AI-generated comprehensive analysis data
  const comprehensiveAnalysis = analysis.comprehensiveAnalysis
  const productionReadiness = comprehensiveAnalysis?.productionReadiness
  const mitigationSteps = comprehensiveAnalysis?.mitigationSteps || []
  const productionChecklist = comprehensiveAnalysis?.productionChecklist || []
  const riskCategories = comprehensiveAnalysis?.riskCategories || []

  // Filter mitigation steps by category
  const budgetMitigation = mitigationSteps.filter(step => 
    step.category.toLowerCase().includes('budget') || 
    step.category.toLowerCase().includes('cost')
  )
  const logisticsMitigation = mitigationSteps.filter(step => 
    step.category.toLowerCase().includes('logistics') ||
    step.category.toLowerCase().includes('planning')
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider mb-1">COST IMPACT ANALYSIS</h1>
        <p className="text-sm text-neutral-400">AI-Generated Production Budget Assessment</p>
      </div>

      {/* Production Readiness Score */}
      {productionReadiness && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-2">FEASIBILITY SCORE</p>
                  <p className={`text-4xl font-bold font-mono ${getCostPressureColor(productionReadiness.score)}`}>
                    {productionReadiness.score}/100
                  </p>
                  <Badge className={getCostBadgeColor(productionReadiness.level)} variant="outline">
                    {productionReadiness.level}
                  </Badge>
                </div>
                <TrendingUp className={`w-12 h-12 ${getCostPressureColor(productionReadiness.score)}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-2">MITIGATION ACTIONS</p>
                  <p className="text-4xl font-bold text-white font-mono">
                    {mitigationSteps.length}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">AI-recommended steps</p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Production Readiness Description */}
      {productionReadiness && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">AI PRODUCTION ASSESSMENT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {productionReadiness.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Risk Categories - Budget & Logistics Focus */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">COST-IMPACTING RISK FACTORS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskCategories.map((risk, index) => (
              <div key={index} className="p-4 bg-neutral-800 border border-neutral-700 rounded">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200">{risk.name}</h4>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getCostBadgeColor(risk.level)}>
                        {risk.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {risk.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{risk.explanation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Mitigation Steps */}
      {budgetMitigation.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">BUDGET MITIGATION STRATEGIES</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetMitigation.map((mitigation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                    {mitigation.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {mitigation.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed">{mitigation.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logistics Mitigation Steps */}
      {logisticsMitigation.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">LOGISTICS & PLANNING STRATEGIES</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logisticsMitigation.map((mitigation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold shrink-0 mt-0.5">
                    {mitigation.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {mitigation.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed">{mitigation.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Production Checklist */}
      {productionChecklist.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PRODUCTION CHECKLIST</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productionChecklist.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-neutral-800 border border-neutral-700 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium text-neutral-200">{item.title}</h4>
                      <Badge className={getConstraintColor(item.constraintLevel)}>
                        {item.constraintLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
                    <p className="text-xs text-neutral-500 mt-2">Affected by: {item.affectedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planning Warnings */}
      {comprehensiveAnalysis?.planningWarnings && comprehensiveAnalysis.planningWarnings.length > 0 && (
        <Card className="bg-neutral-900 border-orange-500/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">COST-RELATED WARNINGS</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {comprehensiveAnalysis.planningWarnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-neutral-800 border border-orange-500/30 rounded">
                  <Badge className={
                    warning.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    warning.severity === 'moderate' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }>
                    {warning.severity}
                  </Badge>
                  <p className="text-sm text-neutral-300 leading-relaxed">{warning.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
        <Shield className="w-3 h-3" />
        <span>100% AI-Generated Analysis using Gemini 2.5 Flash Lite</span>
      </div>
    </div>
  )
}