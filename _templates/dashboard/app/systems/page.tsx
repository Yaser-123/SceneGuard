"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, BarChart3, TrendingUp } from "lucide-react"

export default function AnalysisHistoryPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  const analysisHistory = [
    {
      id: "AN-001",
      sceneTitle: "Night chase through downtown streets with crowd elements",
      date: "2026-01-28",
      timestamp: "14:32 UTC",
      location: "Los Angeles, CA",
      riskLevel: "high",
      feasibilityScore: 78,
      status: "completed",
      summary: "Complex night shoot with moderate crowd involvement",
      costImpact: "High (+140%)",
      weatherRisk: "Low",
      keyRisks: ["Night shoot", "Crowd control", "Traffic closure"],
    },
    {
      id: "AN-002",
      sceneTitle: "Interior office confrontation with minimal crew access",
      date: "2026-01-27",
      timestamp: "09:15 UTC",
      location: "New York, NY",
      riskLevel: "low",
      feasibilityScore: 92,
      status: "completed",
      summary: "Standard interior scene with straightforward requirements",
      costImpact: "Low (+15%)",
      weatherRisk: "N/A",
      keyRisks: ["None identified"],
    },
    {
      id: "AN-003",
      sceneTitle: "Rooftop sequence with stunt work and VFX integration",
      date: "2026-01-26",
      timestamp: "16:48 UTC",
      location: "Vancouver, BC",
      riskLevel: "critical",
      feasibilityScore: 58,
      status: "flagged",
      summary: "High-complexity scene with safety and technical concerns",
      costImpact: "Critical (+200%)",
      weatherRisk: "High",
      keyRisks: ["VFX/Stunts", "Heights", "Weather dependency", "Weather conditions"],
    },
    {
      id: "AN-004",
      sceneTitle: "Market sequence with extras and period-accurate set dressing",
      date: "2026-01-25",
      timestamp: "11:22 UTC",
      location: "Rome, Italy",
      riskLevel: "medium",
      feasibilityScore: 72,
      status: "completed",
      summary: "Moderate complexity with crowd and logistical considerations",
      costImpact: "Medium (+85%)",
      weatherRisk: "Low",
      keyRisks: ["Crowd control", "Permits", "Set logistics"],
    },
    {
      id: "AN-005",
      sceneTitle: "Underwater sequence with diving safety requirements",
      date: "2026-01-24",
      timestamp: "13:56 UTC",
      location: "Sydney, Australia",
      riskLevel: "critical",
      feasibilityScore: 45,
      status: "flagged",
      summary: "Specialized sequence requiring expert coordination",
      costImpact: "Critical (+250%)",
      weatherRisk: "Medium",
      keyRisks: ["Safety & logistics", "Equipment access", "Crew specialization"],
    },
    {
      id: "AN-006",
      sceneTitle: "Quiet dialogue scene in suburban home setting",
      date: "2026-01-23",
      timestamp: "10:05 UTC",
      location: "Portland, OR",
      riskLevel: "low",
      feasibilityScore: 95,
      status: "completed",
      summary: "Simple scene with minimal production requirements",
      costImpact: "Low (+8%)",
      weatherRisk: "N/A",
      keyRisks: ["None identified"],
    },
    {
      id: "AN-007",
      sceneTitle: "Desert chase with practical vehicles and explosions",
      date: "2026-01-22",
      timestamp: "15:33 UTC",
      location: "Arizona",
      riskLevel: "high",
      feasibilityScore: 68,
      status: "completed",
      summary: "Action-heavy scene with stunt coordination needs",
      costImpact: "High (+160%)",
      weatherRisk: "Medium",
      keyRisks: ["VFX/Stunts", "Safety & logistics", "Environmental hazards"],
    },
    {
      id: "AN-008",
      sceneTitle: "Intimate character moment with soft lighting requirements",
      date: "2026-01-21",
      timestamp: "09:41 UTC",
      location: "Berlin, Germany",
      riskLevel: "low",
      feasibilityScore: 88,
      status: "completed",
      summary: "Technical but manageable lighting scenario",
      costImpact: "Low (+25%)",
      weatherRisk: "N/A",
      keyRisks: ["Lighting setup"],
    },
  ]

  const getRiskColor = (level) => {
    switch (level) {
      case "critical":
        return "bg-red-500/20 text-red-400"
      case "high":
        return "bg-orange-500/20 text-orange-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "low":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-neutral-500/20 text-neutral-400"
    }
  }

  const getStatusColor = (status) => {
    return status === "flagged" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider mb-1">ANALYSIS HISTORY</h1>
        <p className="text-sm text-neutral-400">Previously analyzed scenes and feasibility assessments</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  {(analysisHistory.reduce((sum, a) => sum + a.feasibilityScore, 0) / analysisHistory.length).toFixed(0)}%
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
                  {analysisHistory.filter((a) => a.riskLevel === "high" || a.riskLevel === "critical").length}
                </p>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400">CAUTION</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">FLAGGED ITEMS</p>
                <p className="text-2xl font-bold text-red-400 font-mono">
                  {analysisHistory.filter((a) => a.status === "flagged").length}
                </p>
              </div>
              <Badge className="bg-red-500/20 text-red-400">REVIEW</Badge>
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
                        <h3 className="text-sm font-bold text-white">{analysis.sceneTitle}</h3>
                        <p className="text-xs text-neutral-400 font-mono">{analysis.id}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 ml-8 text-xs text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{analysis.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{analysis.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                      <Badge className={getRiskColor(analysis.riskLevel)}>{analysis.riskLevel.toUpperCase()}</Badge>
                      <Badge className={getStatusColor(analysis.status)}>{analysis.status.toUpperCase()}</Badge>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400 font-mono">{analysis.feasibilityScore}%</div>
                      <div className="text-xs text-neutral-400">Feasibility Score</div>
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
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedAnalysis.sceneTitle}</CardTitle>
                <p className="text-sm text-neutral-400 font-mono mt-1">{selectedAnalysis.id}</p>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="text-neutral-400 hover:text-white text-2xl font-bold"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">ANALYSIS METADATA</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Analysis ID:</span>
                        <span className="text-white font-mono">{selectedAnalysis.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Date:</span>
                        <span className="text-white font-mono">{selectedAnalysis.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Time:</span>
                        <span className="text-white font-mono">{selectedAnalysis.timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Location:</span>
                        <span className="text-white">{selectedAnalysis.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Status:</span>
                        <Badge className={getStatusColor(selectedAnalysis.status)}>
                          {selectedAnalysis.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">RISK ASSESSMENT</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Risk Level:</span>
                        <Badge className={getRiskColor(selectedAnalysis.riskLevel)}>
                          {selectedAnalysis.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Weather Risk:</span>
                        <span className="text-white">{selectedAnalysis.weatherRisk}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block mb-1">Feasibility Score:</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-neutral-800 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${selectedAnalysis.feasibilityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-mono w-12 text-right">{selectedAnalysis.feasibilityScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">COST & IMPACT</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Cost Impact:</span>
                        <span className="text-orange-400 font-bold">{selectedAnalysis.costImpact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Summary:</span>
                        <span className="text-white text-right">{selectedAnalysis.summary}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">KEY RISK FACTORS</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnalysis.keyRisks.map((risk, idx) => (
                        <Badge key={idx} className="bg-blue-500/20 text-blue-300 text-xs">
                          {risk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-700 pt-4">
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">EXECUTIVE SUMMARY</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">{selectedAnalysis.summary}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors">
                  Export Report
                </button>
                <button className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded font-medium text-sm transition-colors border border-neutral-700">
                  Share Analysis
                </button>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded font-medium text-sm transition-colors border border-neutral-700"
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
