"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, DollarSign, AlertCircle } from "lucide-react"

export default function CostImpactPage() {
  const costData = [
    { category: "Lighting", baseline: 5000, actual: 12000, impact: "+140%" },
    { category: "Crew", baseline: 8000, actual: 15000, impact: "+87%" },
    { category: "Equipment", baseline: 6000, actual: 9500, impact: "+58%" },
    { category: "Permits", baseline: 2000, actual: 4000, impact: "+100%" },
    { category: "Contingency", baseline: 3000, actual: 8000, impact: "+166%" },
  ]

  const sceneCosts = [
    {
      sceneId: "SC-001",
      title: "Night Chase - Downtown",
      baseline: 45000,
      estimated: 72000,
      drivers: ["Night shoot", "Crowd control", "Traffic closure"],
      pressure: "high",
    },
    {
      sceneId: "SC-002",
      title: "Rooftop Confrontation",
      baseline: 38000,
      estimated: 68000,
      drivers: ["Heights", "VFX/Stunts", "Night shoot"],
      pressure: "high",
    },
    {
      sceneId: "SC-003",
      title: "Market Sequence",
      baseline: 32000,
      estimated: 52000,
      drivers: ["Crowd control", "Permits"],
      pressure: "medium",
    },
    {
      sceneId: "SC-004",
      title: "Office Interior",
      baseline: 28000,
      estimated: 35000,
      drivers: ["Standard setup"],
      pressure: "low",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider mb-1">COST IMPACT ANALYSIS</h1>
        <p className="text-sm text-neutral-400">Production budget assessment and cost drivers</p>
      </div>

      {/* Cost Summary Cards - Relative Index */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">BASELINE COST LEVEL</p>
                <p className="text-2xl font-bold text-white font-mono">100</p>
                <p className="text-xs text-neutral-500 mt-1">Reference index</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">RELATIVE COST IMPACT</p>
                <p className="text-2xl font-bold text-white font-mono">160</p>
                <p className="text-xs text-neutral-500 mt-1">Estimated multiplier</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">COST PRESSURE</p>
                <p className="text-2xl font-bold text-orange-400 font-mono">+60%</p>
                <p className="text-xs text-neutral-500 mt-1">Planning factor</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded text-xs text-neutral-400">
        <span className="text-neutral-500 font-medium">Note:</span> Relative comparison for early-stage planning, not final budgeting. Consult professional line producers for accurate budget estimates.
      </div>

      {/* Cost Breakdown Chart */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">COST PRESSURE BY CATEGORY</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="category" stroke="#888888" style={{ fontSize: "12px" }} />
                <YAxis stroke="#888888" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #404040",
                    borderRadius: "4px",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                  formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  footer="Relative comparison for planning"
                />
                <Legend wrapperStyle={{ color: "#888888" }} />
                <Bar dataKey="baseline" fill="#888888" name="Baseline Cost Level" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#f97316" name="Relative Cost Impact" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Scene-by-Scene Cost Analysis */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">SCENE COST IMPACT SUMMARY</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sceneCosts.map((scene) => {
              const increase = ((scene.estimated - scene.baseline) / scene.baseline * 100).toFixed(0)
              return (
                <div key={scene.sceneId} className="border border-neutral-700 rounded p-4 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">{scene.title}</h3>
                      <p className="text-xs text-neutral-400 font-mono">{scene.sceneId}</p>
                    </div>
                    <Badge
                      className={
                        scene.pressure === "high"
                          ? "bg-red-500/20 text-red-400"
                          : scene.pressure === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                      }
                    >
                      {scene.pressure.toUpperCase()} PRESSURE
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Baseline</p>
                      <p className="text-lg font-bold text-neutral-300 font-mono">${(scene.baseline / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Estimated</p>
                      <p className="text-lg font-bold text-orange-400 font-mono">${(scene.estimated / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Increase</p>
                      <p className="text-lg font-bold text-red-400 font-mono">+{increase}%</p>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((scene.estimated / (scene.baseline * 3)) * 100, 100)}%` }}
                    ></div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-700">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-medium text-neutral-300">Cost Drivers:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {scene.drivers.map((driver, idx) => (
                        <Badge key={idx} className="bg-blue-500/20 text-blue-300 text-xs">
                          {driver}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cost Mitigation Strategies */}
      <Card className="bg-neutral-900 border-blue-600 border-2">
        <CardHeader className="pb-3 bg-blue-600/10">
          <CardTitle className="text-sm font-medium text-blue-400 tracking-wider">COST OPTIMIZATION STRATEGIES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-neutral-800 border border-neutral-700">
              <h4 className="text-sm font-bold text-white mb-2">Reduce Scene Complexity</h4>
              <p className="text-xs text-neutral-300 mb-2">
                Simplify requirements where possible without compromising creative vision
              </p>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Use day-for-night techniques to avoid night shoot overhead</li>
                <li>• Reduce crowd sizes with smart filming angles</li>
                <li>• Minimize VFX sequences or combine into single setup</li>
              </ul>
            </div>

            <div className="p-4 rounded bg-neutral-800 border border-neutral-700">
              <h4 className="text-sm font-bold text-white mb-2">Schedule Optimization</h4>
              <p className="text-xs text-neutral-300 mb-2">
                Strategic scheduling can significantly reduce overall costs
              </p>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Cluster similar scenes to reuse setups and crew</li>
                <li>• Shoot during optimal weather/season periods</li>
                <li>• Batch high-cost scenes to maximize crew efficiency</li>
              </ul>
            </div>

            <div className="p-4 rounded bg-neutral-800 border border-neutral-700">
              <h4 className="text-sm font-bold text-white mb-2">Resource Consolidation</h4>
              <p className="text-xs text-neutral-300 mb-2">
                Share resources and personnel across multiple scenes
              </p>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Multi-purpose set design and dressing</li>
                <li>• Rent equipment packages vs individual items</li>
                <li>• Cross-train crew for multiple roles</li>
              </ul>
            </div>

            <div className="p-4 rounded bg-neutral-800 border border-neutral-700">
              <h4 className="text-sm font-bold text-white mb-2">Contingency Planning</h4>
              <p className="text-xs text-neutral-300 mb-2">
                Build smart buffers and alternatives into your budget
              </p>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Allocate 15-20% contingency for high-risk scenes</li>
                <li>• Develop backup location options</li>
                <li>• Pre-identify efficient insurance solutions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
