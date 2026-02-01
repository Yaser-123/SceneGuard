"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Droplets, Wind, Sun, Info } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"

export default function WeatherFeasibilityPage() {
  const { analysis } = useAnalysis()

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case "Good":
        return "bg-green-500/20 text-green-400"
      case "Moderate":
        return "bg-yellow-500/20 text-yellow-400"
      case "Poor":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-neutral-500/20 text-neutral-400"
    }
  }

  if (!analysis) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider mb-1">WEATHER FEASIBILITY</h1>
          <p className="text-sm text-neutral-400">Location-based seasonal risk assessment and recommendations</p>
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

  // Check if weather analysis is not applicable (Indoor/VFX scenes)
  if (!analysis.weatherFeasibility.applicable) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider mb-1">WEATHER FEASIBILITY</h1>
          <p className="text-sm text-neutral-400">Location-based seasonal risk assessment and recommendations</p>
        </div>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Cloud className="w-12 h-12 text-neutral-600 mb-4" />
            <p className="text-neutral-400 text-sm mb-2">
              Weather analysis not applicable for this scene.
            </p>
            <p className="text-neutral-500 text-xs">
              Weather feasibility is only relevant for Outdoor scenes.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const weather = analysis.weatherFeasibility

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider mb-1">WEATHER FEASIBILITY</h1>
        <p className="text-sm text-neutral-400">Location-based seasonal risk assessment and recommendations</p>
      </div>

      {/* Weather Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">LOCATION & MONTH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-400 mb-1">Location</p>
                <p className="text-lg font-bold text-white">{weather.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Target Month</p>
                <p className="text-lg font-bold text-white">{weather.month || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">WEATHER CONDITIONS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weather.averageRainDays !== undefined && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-neutral-400">Avg Rain Days</span>
                </div>
                <span className="text-sm font-mono text-white">{weather.averageRainDays} days</span>
              </div>
            )}
            {weather.averageWindSpeed !== undefined && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-neutral-400">Avg Wind Speed</span>
                </div>
                <span className="text-sm font-mono text-white">{weather.averageWindSpeed} km/h</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendation */}
      {weather.recommendation && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">RECOMMENDATION</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {weather.recommendation}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}