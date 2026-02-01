"use client"

import { useState } from "react"
import { ChevronRight, Monitor, Settings, AlertTriangle, Cloud, History, Bell, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import CommandCenterPage from "./command-center/page"
import RiskSignalsPage from "./agent-network/page"
import CostImpactPage from "./operations/page"
import WeatherFeasibilityPage from "./intelligence/page"
import AnalysisHistoryPage from "./systems/page"

export default function SceneGuardDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-blue-500 font-bold text-lg tracking-wider">SCENEGUARD</h1>
              <p className="text-neutral-500 text-xs">v1.0 PRODUCTION COMMAND</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-blue-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "overview", icon: Monitor, label: "SCENE ANALYSIS" },
              { id: "risks", icon: AlertTriangle, label: "RISK SIGNALS" },
              { id: "cost", icon: Monitor, label: "COST IMPACT" },
              { id: "weather", icon: Cloud, label: "WEATHER FEASIBILITY" },
              { id: "history", icon: History, label: "ANALYSIS HISTORY" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs text-white">SYSTEM ONLINE</span>
              </div>
              <div className="text-xs text-neutral-500">
                <div>STATUS: READY</div>
                <div>SCENES ANALYZED: 124</div>
                <div>AVG FEASIBILITY: 78%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">
              PRODUCTION CENTER / <span className="text-blue-500">FEASIBILITY ANALYSIS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500">LAST UPDATE: 01/30/2026 14:32 UTC</div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-blue-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-blue-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="flex-1">
            {activeSection === "overview" && <CommandCenterPage />}
            {activeSection === "risks" && <RiskSignalsPage />}
            {activeSection === "cost" && <CostImpactPage />}
            {activeSection === "weather" && <WeatherFeasibilityPage />}
            {activeSection === "history" && <AnalysisHistoryPage />}
          </div>
          {/* Footer Disclaimer */}
          <div className="border-t border-neutral-700 bg-neutral-900/50 px-6 py-3">
            <p className="text-xs text-neutral-500">
              <span className="text-neutral-400 font-medium">SceneGuard</span> supports early-stage decision-making and does not replace professional budgeting, scheduling, or production planning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
