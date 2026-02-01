"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Cloud, Zap, Waves, AlertTriangle, Heater as HeartAlert } from "lucide-react"

export default function RiskSignalsPage() {
  const riskCategories = [
    {
      id: 1,
      title: "Crowd Control",
      riskLevel: "high",
      icon: Users,
      description: "Large gathering scenes require crowd management, security, and traffic control measures.",
      examples: ["Street riots", "Public events", "Market scenes", "Parade sequences"],
      mitigation: "Plan with local authorities, hire professional crowd coordinators, secure proper permits",
    },
    {
      id: 2,
      title: "Night Shoot",
      riskLevel: "medium",
      icon: Cloud,
      description: "Night filming requires comprehensive lighting rigs, extended crew hours, and safety protocols.",
      examples: ["Exterior night scenes", "Low-light interiors", "Underground sequences"],
      mitigation: "Budget for additional lighting equipment, plan for overtime, establish safety perimeter",
    },
    {
      id: 3,
      title: "Weather Dependency",
      riskLevel: "high",
      icon: Cloud,
      description: "Outdoor scenes are heavily dependent on weather conditions and seasonal variations.",
      examples: ["Rain scenes", "Snow sequences", "Clear sky requirements"],
      mitigation: "Scout multiple locations, plan backup dates, prepare weather contingency budget",
    },
    {
      id: 4,
      title: "VFX / Stunts",
      riskLevel: "critical",
      icon: Zap,
      description: "Scenes involving visual effects or stunt work require specialized crew and extensive planning.",
      examples: ["Action sequences", "Wire work", "Explosions", "CGI integration"],
      mitigation: "Hire certified stunt coordinators, conduct safety rehearsals, obtain insurance",
    },
    {
      id: 5,
      title: "Safety & Logistics",
      riskLevel: "medium",
      icon: AlertTriangle,
      description: "Complex filming locations may present logistical challenges and safety concerns.",
      examples: ["Water scenes", "Heights", "Remote locations", "Hazardous environments"],
      mitigation: "Conduct safety audits, plan emergency protocols, ensure adequate medical support",
    },
    {
      id: 6,
      title: "Equipment Access",
      riskLevel: "low",
      icon: Waves,
      description: "Specialized equipment availability and technical requirements for specific scenes.",
      examples: ["Aerial shots", "Underwater scenes", "Thermal imaging"],
      mitigation: "Book equipment early, verify technical specifications, arrange backup solutions",
    },
  ]

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

  const getRiskBadgeColor = (level) => {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider mb-1">RISK SIGNALS</h1>
        <p className="text-sm text-neutral-400">Production risk categories and mitigation strategies</p>
      </div>

      {/* Risk Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {riskCategories.map((risk) => {
          const IconComponent = risk.icon
          return (
            <Card key={risk.id} className={`bg-neutral-900 border-2 ${getRiskColor(risk.riskLevel)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <IconComponent className="w-5 h-5 mt-1 text-blue-400" />
                    <div>
                      <CardTitle className="text-base font-bold text-white">{risk.title}</CardTitle>
                      <p className="text-xs text-neutral-400 mt-1">{risk.description}</p>
                    </div>
                  </div>
                  <Badge className={getRiskBadgeColor(risk.riskLevel)}>{risk.riskLevel.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-neutral-300 tracking-wider mb-2">COMMON SCENARIOS</h4>
                  <div className="flex flex-wrap gap-1">
                    {risk.examples.map((example, idx) => (
                      <Badge key={idx} className="bg-neutral-800 text-neutral-300 text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-700 pt-3">
                  <h4 className="text-xs font-medium text-neutral-300 tracking-wider mb-2">MITIGATION APPROACH</h4>
                  <p className="text-sm text-neutral-300">{risk.mitigation}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Overall Risk Summary */}
      <Card className="bg-neutral-900 border-blue-600 border-2 lg:col-span-2">
        <CardHeader className="pb-3 bg-blue-600/10">
          <CardTitle className="text-sm font-medium text-blue-400 tracking-wider">RISK ASSESSMENT GUIDE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded bg-red-500/10 border border-red-500/30">
              <div className="text-xs font-bold text-red-400 mb-1">CRITICAL</div>
              <p className="text-xs text-neutral-300">Requires specialized crew, extensive planning, and high budget allocation</p>
            </div>
            <div className="p-4 rounded bg-orange-500/10 border border-orange-500/30">
              <div className="text-xs font-bold text-orange-400 mb-1">HIGH</div>
              <p className="text-xs text-neutral-300">Significant production impact and budget considerations</p>
            </div>
            <div className="p-4 rounded bg-yellow-500/10 border border-yellow-500/30">
              <div className="text-xs font-bold text-yellow-400 mb-1">MEDIUM</div>
              <p className="text-xs text-neutral-300">Moderate planning needed with contingency budgets</p>
            </div>
            <div className="p-4 rounded bg-green-500/10 border border-green-500/30">
              <div className="text-xs font-bold text-green-400 mb-1">LOW</div>
              <p className="text-xs text-neutral-300">Standard production procedures and resources sufficient</p>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-4">
            <h4 className="text-xs font-medium text-neutral-300 tracking-wider mb-3">RISK COMBINATION EFFECTS</h4>
            <p className="text-sm text-neutral-300 mb-3">
              When multiple risk factors combine (e.g., Night Shoot + Crowd Control + VFX), costs and complexity increase exponentially. Always account for cumulative risk multipliers.
            </p>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>2-3 high risks: 1.5x-2x cost multiplier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>3+ high risks or 1+ critical: 2x-3x cost multiplier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>All factors present: Consider scene redesign or location alternatives</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
