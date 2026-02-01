"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, FileText } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"
import ResultsView from "@/components/results-view"
import { parseFileToText } from "@/lib/file-parser"

export default function SceneAnalysisPage() {
  const router = useRouter()
  const { analysis, setAnalysis, isLoading, setIsLoading, error, setError } = useAnalysis()
  
  const [sceneDescription, setSceneDescription] = useState("")
  const [location, setLocation] = useState("")
  const [sceneCategory, setSceneCategory] = useState("Outdoor")
  const [timeOfDay, setTimeOfDay] = useState("Day")
  const [month, setMonth] = useState("June")

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isParsingFile, setIsParsingFile] = useState(false)

  // Optional cost inputs
  const [extrasRange, setExtrasRange] = useState<string | undefined>(undefined)
  const [controlledSet, setControlledSet] = useState<boolean | undefined>(undefined)
  const [scheduleFlexibility, setScheduleFlexibility] = useState<boolean | undefined>(undefined)
  const [locationComplexity, setLocationComplexity] = useState<string | undefined>(undefined)
  const [unionCrew, setUnionCrew] = useState<boolean | undefined>(undefined)
  const [budgetConstraint, setBudgetConstraint] = useState<string | undefined>(undefined)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    const fileExtension = file.name.toLowerCase().split('.').pop()

    if (!allowedTypes.includes(file.type) && !['pdf', 'docx', 'doc'].includes(fileExtension || '')) {
      setError("Please upload only PDF or Word documents (.pdf, .doc, .docx)")
      return
    }

    setUploadedFile(file)
    setIsParsingFile(true)
    setError(null)

    try {
      const extractedText = await parseFileToText(file)
      setSceneDescription(extractedText)
    } catch (err: any) {
      setError(`Failed to parse file: ${err.message}`)
      setUploadedFile(null)
    } finally {
      setIsParsingFile(false)
    }
  }

  const handleAnalyzeScene = async () => {
    const textToAnalyze = sceneDescription.trim()

    if (!textToAnalyze) {
      setError("Please enter a scene description or upload a file")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Build request body based on scene category
      const requestBody: any = {
        sceneDescription: textToAnalyze,
        sceneCategory,
      }

      // Add optional fields based on scene type
      if (timeOfDay) {
        requestBody.timeOfDay = timeOfDay
      }

      // Outdoor scenes require location and month
      if (sceneCategory === "Outdoor") {
        if (!location.trim()) {
          setError("Location is required for outdoor scenes")
          setIsLoading(false)
          return
        }
        if (!month) {
          setError("Month is required for outdoor scenes")
          setIsLoading(false)
          return
        }
        requestBody.location = location.trim()
        requestBody.month = month
      }

      // Add optional cost inputs if provided
      const costInputs: any = {}
      if (extrasRange) costInputs.extrasRange = extrasRange
      if (controlledSet !== undefined) costInputs.controlledSet = controlledSet
      if (scheduleFlexibility !== undefined) costInputs.scheduleFlexibility = scheduleFlexibility
      if (locationComplexity) costInputs.locationComplexity = locationComplexity
      if (unionCrew !== undefined) costInputs.unionCrew = unionCrew
      if (budgetConstraint) costInputs.budgetConstraint = budgetConstraint
      
      if (Object.keys(costInputs).length > 0) {
        requestBody.costInputs = costInputs
      }

      const response = await fetch('/api/scene/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setAnalysis(data)
      
      // Success - keep user on this page to see results
    } catch (err: any) {
      setError(err.message || 'Failed to analyze scene')
    } finally {
      setIsLoading(false)
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
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="text-xs text-neutral-400 tracking-wider mb-2 block">SCENE DESCRIPTION</label>
            <textarea
              value={sceneDescription}
              onChange={(e) => setSceneDescription(e.target.value)}
              placeholder="Paste a film scene description here..."
              className="w-full h-32 bg-neutral-800 border border-neutral-600 rounded p-3 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* File Upload Section */}
          <div>
            <label className="text-xs text-neutral-400 tracking-wider mb-2 block">OR UPLOAD SCRIPT FILE</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isLoading || isParsingFile}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-600 rounded text-neutral-300 text-sm hover:bg-neutral-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isParsingFile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {isParsingFile ? 'Parsing...' : 'Upload PDF/DOC'}
              </label>
              {uploadedFile && (
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{uploadedFile.name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1">Supported formats: PDF, DOC, DOCX</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-2 block">CATEGORY</label>
              <select
                value={sceneCategory}
                onChange={(e) => setSceneCategory(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              >
                <option>Indoor</option>
                <option>Outdoor</option>
                <option>VFX</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-2 block">TIME OF DAY</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              >
                <option>Day</option>
                <option>Night</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-2 block">
                LOCATION {sceneCategory === 'Outdoor' && <span className="text-red-400">*</span>}
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Los Angeles, CA"
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-2 block">
                MONTH {sceneCategory === 'Outdoor' && <span className="text-red-400">*</span>}
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                disabled={isLoading}
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

          {/* Optional Cost Inputs */}
          <div className="border-t border-neutral-700 pt-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider">OPTIONAL COST INPUTS</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Provide additional context for more accurate cost analysis
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-neutral-400 tracking-wider mb-2 block">EXTRAS RANGE</label>
                <select
                  value={extrasRange || ""}
                  onChange={(e) => setExtrasRange(e.target.value || undefined)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="">Not specified</option>
                  <option value="none">None</option>
                  <option value="small">Small (1-10)</option>
                  <option value="medium">Medium (10-50)</option>
                  <option value="large">Large (50+)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 tracking-wider mb-2 block">LOCATION COMPLEXITY</label>
                <select
                  value={locationComplexity || ""}
                  onChange={(e) => setLocationComplexity(e.target.value || undefined)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="">Not specified</option>
                  <option value="city">City/Urban</option>
                  <option value="remote">Remote/Rural</option>
                  <option value="studio">Studio</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 tracking-wider mb-2 block">CONTROLLED SET</label>
                <select
                  value={controlledSet === undefined ? "" : controlledSet.toString()}
                  onChange={(e) => setControlledSet(e.target.value === "" ? undefined : e.target.value === "true")}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 tracking-wider mb-2 block">SCHEDULE FLEXIBILITY</label>
                <select
                  value={scheduleFlexibility === undefined ? "" : scheduleFlexibility.toString()}
                  onChange={(e) => setScheduleFlexibility(e.target.value === "" ? undefined : e.target.value === "true")}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="">Not specified</option>
                  <option value="true">Flexible</option>
                  <option value="false">Fixed</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 tracking-wider mb-2 block">UNION CREW</label>
                <select
                  value={unionCrew === undefined ? "" : unionCrew.toString()}
                  onChange={(e) => setUnionCrew(e.target.value === "" ? undefined : e.target.value === "true")}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 tracking-wider mb-2 block">BUDGET CONSTRAINT</label>
                <select
                  value={budgetConstraint || ""}
                  onChange={(e) => setBudgetConstraint(e.target.value || undefined)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="">Not specified</option>
                  <option value="highly_constrained">Highly Constrained</option>
                  <option value="moderately_constrained">Moderately Constrained</option>
                  <option value="flexible">Flexible</option>
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  Budget constraint is evaluated relative to this scene, not as a monetary value.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleAnalyzeScene}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                ANALYZING...
              </span>
            ) : (
              'ANALYZE SCENE'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results - PPT Layout */}
      {analysis && analysis.constraintIntelligence && (
        <ResultsView analysis={analysis} />
      )}
    </div>
  )
}
