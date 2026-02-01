"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info, Shield } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'

export default function RiskSignalsPage() {
  const { analysis } = useAnalysis()

  const getRiskLevelColor = (level: string) => {
    const lowerLevel = level?.toLowerCase() || ''
    if (lowerLevel.includes('high') || lowerLevel.includes('critical')) {
      return "bg-red-500/20 text-red-400 border-red-500/50"
    } else if (lowerLevel.includes('medium') || lowerLevel.includes('moderate')) {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
    } else if (lowerLevel.includes('low') || lowerLevel.includes('minimal')) {
      return "bg-green-500/20 text-green-400 border-green-500/50"
    }
    return "bg-neutral-500/20 text-neutral-400 border-neutral-500/50"
  }

  const getRiskBadgeColor = (level: string) => {
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

  const getPriorityColor = (priority: string) => {
    const lowerPriority = priority?.toLowerCase() || ''
    if (lowerPriority.includes('immediate') || lowerPriority.includes('critical')) {
      return "bg-red-500/20 text-red-400"
    } else if (lowerPriority.includes('high') || lowerPriority.includes('important')) {
      return "bg-orange-500/20 text-orange-400"
    } else if (lowerPriority.includes('medium') || lowerPriority.includes('moderate')) {
      return "bg-yellow-500/20 text-yellow-400"
    }
    return "bg-blue-500/20 text-blue-400"
  }

  const getRiskIcon = (level: string) => {
    const lowerLevel = level?.toLowerCase() || ''
    if (lowerLevel.includes('high') || lowerLevel.includes('critical')) {
      return AlertTriangle
    } else if (lowerLevel.includes('medium') || lowerLevel.includes('moderate')) {
      return AlertCircle
    }
    return Info
  }

  if (!analysis) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider mb-1">RISK SIGNALS</h1>
          <p className="text-sm text-neutral-400">AI-Generated Production Risk Assessment</p>
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
  const riskCategories = comprehensiveAnalysis?.riskCategories || []
  const productionReadiness = comprehensiveAnalysis?.productionReadiness

  // Prepare chart data from AI risk categories with numeric values for chart
  const riskDistribution = riskCategories.map(cat => {
    const numericLevel = 
      cat.level === 'High' ? 3 :
      cat.level === 'Medium' ? 2 :
      cat.level === 'Low' ? 1 : 0
    return {
      category: cat.name,
      level: cat.level,
      numericLevel: numericLevel,
      priority: cat.priority
    }
  })

  const getBarColor = (level: string) => {
    const lowerLevel = level?.toLowerCase() || ''
    if (lowerLevel.includes('high') || lowerLevel.includes('critical')) return "#ef4444"
    if (lowerLevel.includes('medium') || lowerLevel.includes('moderate')) return "#eab308"
    if (lowerLevel.includes('low') || lowerLevel.includes('minimal')) return "#22c55e"
    return "#737373"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider mb-1">RISK SIGNALS</h1>
        <p className="text-sm text-neutral-400">AI-Generated Production Risk Assessment</p>
      </div>

      {/* Production Readiness Overview */}
      {productionReadiness && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PRODUCTION READINESS</CardTitle>
              <Badge className={getRiskBadgeColor(productionReadiness.level)}>
                {productionReadiness.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded">
              <div>
                <div className="text-sm text-neutral-400 mb-1">Feasibility Score</div>
                <div className={`text-3xl font-bold ${
                  productionReadiness.score >= 80 ? 'text-green-500' :
                  productionReadiness.score >= 60 ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {productionReadiness.score}/100
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-400 mb-1">Risk Categories</div>
                <div className="text-3xl font-bold text-white">
                  {riskCategories.length}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-700 pt-4">
              <h4 className="text-xs font-medium text-neutral-300 tracking-wider mb-3">AI ASSESSMENT</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {productionReadiness.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Distribution Chart */}
      {riskDistribution.length > 0 && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">RISK CATEGORY OVERVIEW</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis 
                  dataKey="category" 
                  stroke="#a3a3a3" 
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  hide
                  stroke="#a3a3a3" 
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#171717', 
                    border: '1px solid #404040',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: '#e5e5e5' }}
                  formatter={((value: any, name: any, props: any) => [props.payload.level, 'Risk Level']) as any}
                />
                <Bar dataKey="numericLevel" radius={[4, 4, 0, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.level)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* AI-Generated Risk Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {riskCategories.map((risk, index) => {
          const Icon = getRiskIcon(risk.level)
          return (
            <Card key={index} className={`bg-neutral-900 border ${getRiskLevelColor(risk.level)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 shrink-0" />
                    <CardTitle className="text-sm font-medium">{risk.name}</CardTitle>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge className={getRiskBadgeColor(risk.level)}>
                      {risk.level}
                    </Badge>
                    <Badge className={getPriorityColor(risk.priority)} variant="outline">
                      {risk.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-300 leading-relaxed">{risk.explanation}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Planning Warnings */}
      {comprehensiveAnalysis?.planningWarnings && comprehensiveAnalysis.planningWarnings.length > 0 && (
        <Card className="bg-neutral-900 border-orange-500/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PLANNING WARNINGS</CardTitle>
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
