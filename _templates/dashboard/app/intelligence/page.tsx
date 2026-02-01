"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Droplets, Wind, Sun, AlertTriangle, MapPin } from "lucide-react"

export default function WeatherFeasibilityPage() {
  const [selectedLocation, setSelectedLocation] = useState("Los Angeles, CA")

  const locationWeatherData = {
    "Los Angeles, CA": {
      currentMonth: "January",
      riskLevel: "low",
      avgTemp: "62°F",
      precipChance: "12%",
      humidity: "58%",
      windSpeed: "8 mph",
      issues: ["Occasional rain possible", "Cool but workable"],
      recommendation: "Excellent conditions for most scenes. Plan light rain contingency.",
      alternateMonth: "May-September",
      alternateReason: "More consistent dry weather, extended daylight",
    },
    "Vancouver, BC": {
      currentMonth: "January",
      riskLevel: "high",
      avgTemp: "42°F",
      precipChance: "68%",
      humidity: "75%",
      windSpeed: "12 mph",
      issues: ["Heavy rain expected", "Dark overcast skies", "Cold temperatures"],
      recommendation: "Consider postponing or shifting to covered interiors.",
      alternateMonth: "July-August",
      alternateReason: "Dry season with moderate temperatures",
    },
    "New York, NY": {
      currentMonth: "January",
      riskLevel: "critical",
      avgTemp: "28°F",
      precipChance: "45%",
      humidity: "62%",
      windSpeed: "18 mph",
      issues: ["Potential snow/ice", "Extreme cold", "High wind", "Short daylight"],
      recommendation: "High-risk season. Strong contingency budget essential.",
      alternateMonth: "May or September-October",
      alternateReason: "Stable weather and optimal daylight hours",
    },
    "Sydney, Australia": {
      currentMonth: "January",
      riskLevel: "medium",
      avgTemp: "79°F",
      precipChance: "32%",
      humidity: "68%",
      windSpeed: "10 mph",
      issues: ["Summer heat", "Afternoon storms possible", "High UV"],
      recommendation: "Plan early morning shoots, extended breaks. UV protection essential.",
      alternateMonth: "April-May or September-October",
      alternateReason: "Perfect weather conditions, mild temperatures",
    },
  }

  const currentData = locationWeatherData[selectedLocation]

  const getRiskColor = (level) => {
    switch (level) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/50"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider mb-1">WEATHER FEASIBILITY</h1>
        <p className="text-sm text-neutral-400">Location-based seasonal risk assessment and recommendations</p>
      </div>

      {/* Location Selector */}
      <div>
        <label className="text-xs text-neutral-400 tracking-wider mb-2 block">SELECT FILMING LOCATION</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.keys(locationWeatherData).map((location) => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={`p-3 rounded border-2 transition-all text-left ${
                selectedLocation === location
                  ? "bg-blue-500/20 border-blue-500 text-white"
                  : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="font-medium text-sm">{location}</span>
              </div>
              <span className="text-xs text-neutral-500">View weather</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weather Overview */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6`}>
        {/* Risk Assessment Card */}
        <Card className={`lg:col-span-4 bg-neutral-900 border-2 ${getRiskColor(currentData.riskLevel)}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">WEATHER RISK LEVEL</CardTitle>
              <Cloud className="w-5 h-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge className={getRiskColor(currentData.riskLevel)}>{currentData.riskLevel.toUpperCase()}</Badge>
              <p className="text-sm text-neutral-400 mt-3">for {currentData.currentMonth}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-700">
              <div>
                <p className="text-xs text-neutral-400 mb-1">Avg Temp</p>
                <p className="text-lg font-bold text-white">{currentData.avgTemp}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Precipitation</p>
                <p className="text-lg font-bold text-white">{currentData.precipChance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Conditions Snapshot */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">SEASONAL CONDITIONS SNAPSHOT</CardTitle>
              <p className="text-xs text-neutral-500 mt-1">Based on historical averages for the selected period</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-neutral-400">Humidity</span>
              </div>
              <span className="text-sm font-mono text-white">{currentData.humidity}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-neutral-400">Wind Speed</span>
              </div>
              <span className="text-sm font-mono text-white">{currentData.windSpeed}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-neutral-400">UV Index</span>
              </div>
              <span className="text-sm font-mono text-white">Moderate</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-neutral-400">Cloud Cover</span>
              </div>
              <span className="text-sm font-mono text-white">65%</span>
            </div>
          </CardContent>
        </Card>

        {/* Issues & Concerns */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">POTENTIAL ISSUES</CardTitle>
          </CardHeader>
          <CardContent>
            {currentData.issues.length > 0 ? (
              <div className="space-y-2">
                {currentData.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-neutral-800 rounded">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-neutral-300">{issue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-green-400">No major weather concerns for this period</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-neutral-900 border-blue-600 border-2">
        <CardHeader className="pb-3 bg-blue-600/10">
          <CardTitle className="text-sm font-medium text-blue-400 tracking-wider">PRODUCTION RECOMMENDATION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded bg-neutral-800 border border-neutral-700">
            <h4 className="text-sm font-bold text-white mb-2">Assessment for {selectedLocation}</h4>
            <p className="text-sm text-neutral-300">{currentData.recommendation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-neutral-300 tracking-wider mb-2">MITIGATION STRATEGIES</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Scout backup locations with different exposure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Build 15-20% additional contingency time into schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Acquire weather insurance for high-risk periods</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Prepare backup interior scenes that can be deployed</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium text-neutral-300 tracking-wider mb-2">RECOMMENDED ALTERNATE PERIOD</h4>
              <div className="p-3 rounded bg-green-500/10 border border-green-500/30">
                <p className="text-sm font-bold text-green-400 mb-1">{currentData.alternateMonth}</p>
                <p className="text-xs text-neutral-300">{currentData.alternateReason}</p>
              </div>

              <div className="mt-3 p-3 rounded bg-neutral-800 border border-neutral-700">
                <p className="text-xs font-medium text-neutral-300 mb-2">Estimated Cost Variance:</p>
                <p className="text-sm font-bold text-blue-400">-25% to -40% budget</p>
                <p className="text-xs text-neutral-400 mt-1">Fewer contingency costs & better crew efficiency</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Overview */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">ANNUAL WEATHER PATTERN</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { month: "Jan", risk: "high", color: "orange" },
              { month: "Feb", risk: "medium", color: "yellow" },
              { month: "Mar", risk: "low", color: "green" },
              { month: "Apr", risk: "low", color: "green" },
              { month: "May", risk: "low", color: "green" },
              { month: "Jun", risk: "medium", color: "yellow" },
              { month: "Jul", risk: "high", color: "orange" },
              { month: "Aug", risk: "medium", color: "yellow" },
              { month: "Sep", risk: "low", color: "green" },
              { month: "Oct", risk: "low", color: "green" },
              { month: "Nov", risk: "medium", color: "yellow" },
              { month: "Dec", risk: "critical", color: "red" },
            ].map((item) => (
              <div
                key={item.month}
                className={`p-3 rounded text-center ${
                  item.color === "red"
                    ? "bg-red-500/20 border border-red-500/50"
                    : item.color === "orange"
                      ? "bg-orange-500/20 border border-orange-500/50"
                      : item.color === "yellow"
                        ? "bg-yellow-500/20 border border-yellow-500/50"
                        : "bg-green-500/20 border border-green-500/50"
                }`}
              >
                <p className="text-xs font-bold text-white">{item.month}</p>
                <p
                  className={`text-xs mt-1 ${
                    item.color === "red"
                      ? "text-red-400"
                      : item.color === "orange"
                        ? "text-orange-400"
                        : item.color === "yellow"
                          ? "text-yellow-400"
                          : "text-green-400"
                  }`}
                >
                  {item.risk}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded text-xs text-neutral-400">
        <span className="text-neutral-500 font-medium">Note:</span> Weather data is based on historical averages and does not replace professional weather forecasting. Consult meteorological experts and production schedulers for filming day decisions.
      </div>
    </div>
  )
}
