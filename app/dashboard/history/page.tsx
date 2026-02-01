"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, BarChart3, TrendingUp, Info, Loader2, AlertTriangle } from "lucide-react"
import { getAnalysisHistory } from "@/lib/db-actions"

interface AnalysisHistory {
  id: string
  sceneDescription: string
  category: string | null
  feasibilityScore: number | null
  createdAt: Date
  finalAnalysisJson: any
}

export default function AnalysisHistoryPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisHistory | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        const data = await getAnalysisHistory()
        setAnalysisHistory(data as AnalysisHistory[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getRiskColor = (riskMultiplier: number) => {
    if (riskMultiplier >= 1.3) return "bg-red-500/20 text-red-400"
    if (riskMultiplier >= 1.15) return "bg-yellow-500/20 text-yellow-400"
    return "bg-green-500/20 text-green-400"
  }

  const getRiskLevel = (riskMultiplier: number) => {
    if (riskMultiplier >= 1.3) return "High"
    if (riskMultiplier >= 1.15) return "Medium"
    return "Low"
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider mb-1">ANALYSIS HISTORY</h1>
          <p className="text-sm text-neutral-400">Previously analyzed scenes and feasibility assessments</p>
        </div>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-400 mb-4 animate-spin" />
            <p className="text-neutral-400 text-sm">Loading analysis history...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider mb-1">ANALYSIS HISTORY</h1>
          <p className="text-sm text-neutral-400">Previously analyzed scenes and feasibility assessments</p>
        </div>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Info className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-red-400 text-sm mb-2">Error loading history</p>
            <p className="text-neutral-500 text-xs">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (analysisHistory.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider mb-1">ANALYSIS HISTORY</h1>
          <p className="text-sm text-neutral-400">Previously analyzed scenes and feasibility assessments</p>
        </div>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Info className="w-12 h-12 text-neutral-600 mb-4" />
            <p className="text-neutral-400 text-sm mb-2">No analysis history yet</p>
            <p className="text-neutral-500 text-xs">Analyze your first scene to see it here</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const avgFeasibility = analysisHistory.reduce((sum, a) => sum + (a.feasibilityScore || 0), 0) / analysisHistory.length
  const highRiskCount = analysisHistory.filter((a) => {
    const riskMultiplier = a.finalAnalysisJson?.riskAnalysis?.multiplier || 1.0
    return riskMultiplier >= 1.3
  }).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider mb-1">ANALYSIS HISTORY</h1>
        <p className="text-sm text-neutral-400">Previously analyzed scenes and feasibility assessments</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL ANALYZED</p>
                <p className="text-2xl font-bold text-white font-mono">{analysisHistory.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">AVG FEASIBILITY</p>
                <p className="text-2xl font-bold text-white font-mono">
                  {avgFeasibility.toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">HIGH RISK SCENES</p>
                <p className="text-2xl font-bold text-orange-400 font-mono">
                  {highRiskCount}
                </p>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400">CAUTION</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Timeline */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">ANALYSIS TIMELINE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisHistory.map((analysis) => (
              <div
                key={analysis.id}
                onClick={() => setSelectedAnalysis(analysis)}
                className="border border-neutral-700 rounded p-4 hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white line-clamp-2">
                          {analysis.sceneDescription.length > 100 
                            ? `${analysis.sceneDescription.substring(0, 100)}...` 
                            : analysis.sceneDescription}
                        </h3>
                        <p className="text-xs text-neutral-400 font-mono mt-1">{analysis.id.substring(0, 8)}...</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 ml-8 text-xs text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(analysis.createdAt.toISOString())}</span>
                      </div>
                      {analysis.category && (
                        <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                          {analysis.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                      {analysis.finalAnalysisJson?.riskAnalysis?.multiplier && (
                        <Badge className={getRiskColor(analysis.finalAnalysisJson.riskAnalysis.multiplier)}>
                          {getRiskLevel(analysis.finalAnalysisJson.riskAnalysis.multiplier).toUpperCase()}
                        </Badge>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400 font-mono">
                        {analysis.feasibilityScore || 0}%
                      </div>
                      <div className="text-xs text-neutral-400">Feasibility</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Detail Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-700">
              <div className="flex-1 pr-4">
                <CardTitle className="text-xl font-bold text-white tracking-wider line-clamp-2">
                  {selectedAnalysis.sceneDescription}
                </CardTitle>
                <p className="text-sm text-neutral-400 font-mono mt-1">{selectedAnalysis.id}</p>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="text-neutral-400 hover:text-white text-2xl font-bold shrink-0"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">SCENE METADATA</h3>
                    <div className="space-y-2 text-sm">
                      {selectedAnalysis.category && (
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Category:</span>
                          <Badge className="bg-blue-500/20 text-blue-300">{selectedAnalysis.category}</Badge>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Analyzed:</span>
                        <span className="text-white font-mono">
                          {formatDate(selectedAnalysis.createdAt.toISOString())} {formatTime(selectedAnalysis.createdAt.toISOString())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedAnalysis.finalAnalysisJson?.riskAnalysis && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">RISK ASSESSMENT</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Risk Multiplier:</span>
                          <span className="text-orange-400 font-bold">
                            {selectedAnalysis.finalAnalysisJson.riskAnalysis.multiplier.toFixed(2)}x
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Risk Level:</span>
                          <Badge className={getRiskColor(selectedAnalysis.finalAnalysisJson.riskAnalysis.multiplier)}>
                            {getRiskLevel(selectedAnalysis.finalAnalysisJson.riskAnalysis.multiplier).toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Risk Signals:</span>
                          <span className="text-white">{selectedAnalysis.finalAnalysisJson.riskAnalysis.signals?.length || 0}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block mb-1">Feasibility Score:</span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-neutral-800 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${selectedAnalysis.feasibilityScore || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-mono w-12 text-right">{selectedAnalysis.feasibilityScore || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedAnalysis.finalAnalysisJson?.costImpact && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">COST IMPACT</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Cost Pressure:</span>
                          <Badge className={
                            selectedAnalysis.finalAnalysisJson.costImpact.costPressure === 'High' ? 'bg-red-500/20 text-red-400' :
                            selectedAnalysis.finalAnalysisJson.costImpact.costPressure === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }>
                            {selectedAnalysis.finalAnalysisJson.costImpact.costPressure.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Cost Drivers:</span>
                          <span className="text-white">{selectedAnalysis.finalAnalysisJson.costImpact.drivers?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAnalysis.finalAnalysisJson?.riskAnalysis?.signals && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">KEY RISK SIGNALS</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.finalAnalysisJson.riskAnalysis.signals.map((signal: any, idx: number) => (
                          <Badge key={idx} className={
                            signal.level === 'High' ? 'bg-red-500/20 text-red-300' :
                            signal.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-green-500/20 text-green-300'
                          }>
                            {signal.category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedAnalysis.finalAnalysisJson?.comprehensiveAnalysis?.productionReadiness && (
                <div className="border-t border-neutral-700 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">PRODUCTION READINESS</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 text-sm">Score:</span>
                      <span className="text-2xl font-bold text-blue-400 font-mono">
                        {selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.productionReadiness.score}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 text-sm">Level:</span>
                      <Badge className={
                        selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.productionReadiness.level === 'Low Risk' 
                          ? 'bg-green-500/20 text-green-400' :
                        selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.productionReadiness.level === 'Medium Risk'
                          ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                      }>
                        {selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.productionReadiness.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.productionReadiness.description}
                    </p>
                  </div>
                </div>
              )}

              {selectedAnalysis.finalAnalysisJson?.comprehensiveAnalysis?.riskCategories && (
                <div className="border-t border-neutral-700 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-3">RISK CATEGORIES</h3>
                  <div className="space-y-3">
                    {selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.riskCategories.map((category: any, idx: number) => (
                      <div key={idx} className="p-3 bg-neutral-800 rounded border border-neutral-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={
                              category.level === 'High' ? 'bg-red-500/20 text-red-400' :
                              category.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }>
                              {category.level}
                            </Badge>
                            <Badge className="bg-neutral-700 text-neutral-300 text-xs">
                              {category.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-400">{category.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnalysis.finalAnalysisJson?.comprehensiveAnalysis?.planningWarnings && 
               selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.planningWarnings.length > 0 && (
                <div className="border-t border-neutral-700 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-3">PLANNING WARNINGS</h3>
                  <div className="space-y-2">
                    {selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.planningWarnings.map((warning: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded border ${
                        warning.severity === 'critical' ? 'bg-red-500/10 border-red-500/50' :
                        warning.severity === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/50' :
                        'bg-blue-500/10 border-blue-500/50'
                      }`}>
                        <div className="flex items-start gap-2">
                          <Badge className={`text-xs ${
                            warning.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            warning.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {warning.type}
                          </Badge>
                          <p className="text-sm text-neutral-300 flex-1">{warning.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnalysis.finalAnalysisJson?.comprehensiveAnalysis?.mitigationSteps && (
                <div className="border-t border-neutral-700 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-3">MITIGATION STEPS</h3>
                  <div className="space-y-2">
                    {selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.mitigationSteps.map((step: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                          {step.step}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-300">{step.description}</p>
                          <Badge className="mt-1 bg-neutral-700 text-neutral-400 text-xs">
                            {step.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnalysis.finalAnalysisJson?.comprehensiveAnalysis?.productionChecklist && (
                <div className="border-t border-neutral-700 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-3">PRODUCTION CHECKLIST</h3>
                  <div className="space-y-3">
                    {selectedAnalysis.finalAnalysisJson.comprehensiveAnalysis.productionChecklist.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-neutral-800 rounded border border-neutral-700">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-white">{item.title}</span>
                          <Badge className={
                            item.constraintLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                            item.constraintLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }>
                            {item.constraintLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-400 mb-2">{item.description}</p>
                        <p className="text-xs text-neutral-500 italic">⚠ {item.affectedBy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnalysis.finalAnalysisJson?.riskAnalysis?.explanation && (
                <div className="border-t border-neutral-700 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">RISK EXPLANATION</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {selectedAnalysis.finalAnalysisJson.riskAnalysis.explanation}
                  </p>
                </div>
              )}

              {selectedAnalysis.finalAnalysisJson?.weatherFeasibility?.applicable && 
               selectedAnalysis.finalAnalysisJson.weatherFeasibility.recommendation && (
                <div className="border-t border-neutral-700 pt-4">
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">WEATHER RECOMMENDATION</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {selectedAnalysis.finalAnalysisJson.weatherFeasibility.recommendation}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
