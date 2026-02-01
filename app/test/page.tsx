'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testIndoorScene = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scene/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneDescription: "Interior coffee shop, two people having a quiet conversation at a corner table",
          sceneCategory: "Indoor",
          timeOfDay: "Day"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testOutdoorScene = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scene/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneDescription: "Park scene with children playing soccer on a sunny afternoon",
          sceneCategory: "Outdoor",
          timeOfDay: "Day",
          location: "Seattle, WA",
          month: "November"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testActionScene = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scene/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneDescription: "Downtown car chase at night with explosions, stunt drivers, and crowds of pedestrians",
          sceneCategory: "Outdoor",
          timeOfDay: "Night",
          location: "Los Angeles, CA",
          month: "June"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎬 SceneGuard API Test</h1>
        <p className="text-muted-foreground">Test the backend scene analysis endpoint</p>
      </div>

      <div className="grid gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Scenarios</CardTitle>
            <CardDescription>Click a button to test different scene types</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button 
              onClick={testIndoorScene}
              disabled={loading}
              variant="default"
            >
              {loading ? 'Testing...' : '🏠 Indoor Scene (Simple)'}
            </Button>

            <Button 
              onClick={testOutdoorScene}
              disabled={loading}
              variant="default"
            >
              {loading ? 'Testing...' : '🌳 Outdoor Scene (Weather)'}
            </Button>

            <Button 
              onClick={testActionScene}
              disabled={loading}
              variant="default"
            >
              {loading ? 'Testing...' : '💥 Action Scene (High Risk)'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="mb-8 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">❌ Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>✅ Analysis Complete</CardTitle>
              <CardDescription>Analysis ID: {result.analysisId}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Timestamp: {new Date(result.timestamp).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📋 Scene Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold">Category</dt>
                  <dd className="text-muted-foreground">{result.sceneMetadata.category}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Time of Day</dt>
                  <dd className="text-muted-foreground">{result.sceneMetadata.timeOfDay || 'N/A'}</dd>
                </div>
                {result.sceneMetadata.location && (
                  <div>
                    <dt className="font-semibold">Location</dt>
                    <dd className="text-muted-foreground">{result.sceneMetadata.location}</dd>
                  </div>
                )}
                {result.sceneMetadata.month && (
                  <div>
                    <dt className="font-semibold">Month</dt>
                    <dd className="text-muted-foreground">{result.sceneMetadata.month}</dd>
                  </div>
                )}
                <div className="col-span-2">
                  <dt className="font-semibold">Description</dt>
                  <dd className="text-muted-foreground">{result.sceneMetadata.description}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🤖 Gemini Parsing</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold">Has Crowd</dt>
                  <dd className={result.geminiParsing.hasCrowd ? 'text-orange-500' : 'text-green-500'}>
                    {result.geminiParsing.hasCrowd ? 'Yes' : 'No'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Has Stunts</dt>
                  <dd className={result.geminiParsing.hasStunts ? 'text-orange-500' : 'text-green-500'}>
                    {result.geminiParsing.hasStunts ? 'Yes' : 'No'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Has Vehicles</dt>
                  <dd className={result.geminiParsing.hasVehicles ? 'text-orange-500' : 'text-green-500'}>
                    {result.geminiParsing.hasVehicles ? 'Yes' : 'No'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Action Intensity</dt>
                  <dd className={
                    result.geminiParsing.actionIntensity === 'High' ? 'text-red-500' :
                    result.geminiParsing.actionIntensity === 'Medium' ? 'text-orange-500' :
                    'text-green-500'
                  }>
                    {result.geminiParsing.actionIntensity}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Environment Complexity</dt>
                  <dd className={
                    result.geminiParsing.environmentComplexity === 'High' ? 'text-red-500' :
                    result.geminiParsing.environmentComplexity === 'Medium' ? 'text-orange-500' :
                    'text-green-500'
                  }>
                    {result.geminiParsing.environmentComplexity}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚠️ Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{result.riskAnalysis.explanation}</p>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Multiplier:</span>
                  <span className="text-2xl font-bold">{result.riskAnalysis.multiplier}x</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Risk Signals ({result.riskAnalysis.signals.length})</h4>
                <div className="space-y-2">
                  {result.riskAnalysis.signals.map((signal: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{signal.name}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          signal.level === 'High' ? 'bg-red-100 text-red-700' :
                          signal.level === 'Medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {signal.level}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{signal.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💰 Cost Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{result.costImpact.explanation}</p>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Cost Pressure:</span>
                  <span className={`text-2xl font-bold ${
                    result.costImpact.costPressure === 'High' ? 'text-red-500' :
                    result.costImpact.costPressure === 'Medium' ? 'text-orange-500' :
                    'text-green-500'
                  }`}>
                    {result.costImpact.costPressure}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Cost Drivers ({result.costImpact.drivers.length})</h4>
                <div className="space-y-2">
                  {result.costImpact.drivers.map((driver: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="font-semibold mb-1">{driver.category}</div>
                      <p className="text-sm text-muted-foreground">{driver.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {result.weatherFeasibility.applicable && (
            <Card>
              <CardHeader>
                <CardTitle>🌤️ Weather Feasibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-semibold">Location</dt>
                    <dd className="text-muted-foreground">{result.weatherFeasibility.location}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Month</dt>
                    <dd className="text-muted-foreground">{result.weatherFeasibility.month}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Average Rain Days</dt>
                    <dd className="text-muted-foreground">{result.weatherFeasibility.averageRainDays}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Average Wind Speed</dt>
                    <dd className="text-muted-foreground">{result.weatherFeasibility.averageWindSpeed} mph</dd>
                  </div>
                </dl>
                <div>
                  <dt className="font-semibold mb-1">Recommendation</dt>
                  <dd className="text-muted-foreground">{result.weatherFeasibility.recommendation}</dd>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>📍 Planning Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.planningInsights.locationGuidance && (
                <div>
                  <h4 className="font-semibold mb-1">Location Guidance</h4>
                  <p className="text-sm text-muted-foreground">{result.planningInsights.locationGuidance}</p>
                </div>
              )}
              {result.planningInsights.weatherPattern && (
                <div>
                  <h4 className="font-semibold mb-1">Weather Pattern</h4>
                  <p className="text-sm text-muted-foreground">{result.planningInsights.weatherPattern}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-1">Production Recommendation</h4>
                <p className="text-sm text-muted-foreground">{result.planningInsights.productionRecommendation}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔍 Full JSON Response</CardTitle>
              <CardDescription>Complete API response for debugging</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
