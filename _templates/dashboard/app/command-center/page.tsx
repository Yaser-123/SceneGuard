"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react"

export default function SceneAnalysisPage() {
  const [sceneDescription, setSceneDescription] = useState("")
  const [location, setLocation] = useState("")
  const [indoorOutdoor, setIndoorOutdoor] = useState("Outdoor")
  const [dayNight, setDayNight] = useState("Day")
  const [shootMonth, setShootMonth] = useState("June")
  const [analyzed, setAnalyzed] = useState(false)

  const handleAnalyzeScene = () => {
    if (sceneDescription.trim()) {
      setAnalyzed(true)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Scene Input Section */}
      <Card className="lg:col-span-12 bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">SCENE DESCRIPTION INPUT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 tracking-wider mb-2 block">SCENE DESCRIPTION</label>
            <textarea
              value={sceneDescription}
              onChange={(e) => setSceneDescription(e.target.value)}
              placeholder="Paste a film scene description here..."
              className="w-full h-32 bg-neutral-800 border border-neutral-600 rounded p-3 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-2 block">TYPE</label>
              <select
                value={indoorOutdoor}
                onChange={(e) => setIndoorOutdoor(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option>Indoor</option>
                <option>Outdoor</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-2 block">TIME OF DAY</label>
              <select
                value={dayNight}
                onChange={(e) => setDayNight(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option>Day</option>
                <option>Night</option>
                <option>Dawn/Dusk</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-2 block">LOCATION</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Los Angeles, CA"
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-2 block">PLANNED SHOOT MONTH</label>
              <select
                value={shootMonth}
                onChange={(e) => setShootMonth(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleAnalyzeScene}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold tracking-wider"
          >
            ANALYZE SCENE
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Feasibility Score */}
          <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">FEASIBILITY OVERVIEW</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-500 font-mono mb-2">78</div>
                  <div className="text-xs text-neutral-500">FEASIBILITY SCORE (0-100)</div>
                </div>

                <div className="flex items-center justify-center gap-2 p-3 bg-neutral-800 rounded">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-500 font-medium">MEDIUM RISK</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-neutral-400 font-medium">KEY RISK FLAGS:</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400">Weather</Badge>
                    <Badge className="bg-orange-500/20 text-orange-400">Night Shoot</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">SCENE PARAMETERS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Type:</span>
                <span className="text-white font-mono">{indoorOutdoor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Time:</span>
                <span className="text-white font-mono">{dayNight}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Location:</span>
                <span className="text-white font-mono">{location || "TBD"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Target Month:</span>
                <span className="text-white font-mono">{shootMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Complexity:</span>
                <span className="text-white font-mono">Medium</span>
              </div>
            </CardContent>
          </Card>

          {/* Production Impact */}
          <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PRODUCTION IMPACT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Schedule Impact</span>
                <Badge className="bg-green-500/20 text-green-400">Low</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Budget Impact</span>
                <Badge className="bg-orange-500/20 text-orange-400">Medium</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Crew Requirements</span>
                <Badge className="bg-blue-500/20 text-blue-400">Standard+</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Safety Concerns</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">Moderate</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Recommendations */}
          <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">ANALYSIS & RECOMMENDATIONS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xs font-medium text-neutral-300 mb-2 tracking-wider">KEY CHALLENGES</h3>
                <div className="space-y-2 text-sm text-neutral-300">
                  <p>• Night outdoor shooting will require comprehensive lighting setup and extended crew hours</p>
                  <p>• {shootMonth} weather patterns may present unpredictable conditions for this location</p>
                  <p>• Potential permits and location closure requirements need verification</p>
                </div>
              </div>

              <div className="border-t border-neutral-700 pt-4">
                <h3 className="text-xs font-medium text-neutral-300 mb-2 tracking-wider">MITIGATION STRATEGIES</h3>
                <div className="space-y-2 text-sm text-neutral-300">
                  <p>• Consider interior location alternatives or night-for-day shooting techniques</p>
                  <p>• Schedule contingency shooting dates (alternate season or location)</p>
                  <p>• Budget additional for weather coverage insurance and backup setup</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Summary Widget */}
          <Card className="lg:col-span-4 bg-neutral-900 border-blue-600 border-2">
            <CardHeader className="pb-3 bg-blue-600/10">
              <CardTitle className="text-sm font-medium text-blue-400 tracking-wider">ESTIMATED COST PRESSURE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 font-mono mb-1">HIGH</div>
                <p className="text-xs text-neutral-400">Cost Multiplier: 1.6x</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-neutral-300">Additional lighting equipment</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-neutral-300">Extended crew hours (overtime)</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-neutral-300">Weather contingency buffer</span>
                </div>
              </div>

              <Button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs" variant="outline">
                VIEW DETAILED COST BREAKDOWN →
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {!analyzed && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="w-12 h-12 text-neutral-600 mb-4" />
          <p className="text-neutral-400 text-sm">Enter a scene description and click "Analyze Scene" to begin feasibility assessment</p>
        </div>
      )}
    </div>
  )
}
