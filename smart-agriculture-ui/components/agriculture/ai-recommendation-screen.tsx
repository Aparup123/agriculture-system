'use client'

import { useState } from 'react'
import { Brain, X, Droplet } from 'lucide-react'

export default function AIRecommendationScreen() {
  const [showInsights, setShowInsights] = useState(false)
  const [showWaterNeed, setShowWaterNeed] = useState(false)

  const fieldInsights = {
    soilMoisture: {
      label: 'Soil Moisture',
      current: 42,
      unit: '%',
      status: 'warning',
      insight: 'Moisture levels are declining. Consider irrigation within the next 6 hours to maintain optimal crop health.',
    },
    temperature: {
      label: 'Temperature',
      current: 25.8,
      unit: '°C',
      status: 'good',
      insight: 'Temperature is within the optimal range for crop growth.',
    },
    humidity: {
      label: 'Humidity',
      current: 45,
      unit: '%',
      status: 'good',
      insight: 'Humidity levels are balanced, supporting healthy evapotranspiration.',
    },
    rainfall: {
      label: 'Rainfall',
      current: 0,
      unit: 'mm',
      status: 'good',
      insight: 'No rain detected. Next rainfall expected in 2-3 days based on forecast.',
    },
  }

  const waterNeeded = 2.36

  return (
    <div className="flex flex-col h-full p-4 gap-4 bg-background">
      {/* Header */}
      {/* <div>
        <h1 className="text-xl font-bold">Recommendations</h1>
        <p className="text-xs text-foreground/60">AI-powered insights</p>
      </div> */}

      {/* Recommendation Cards */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Water Need Card */}
        <button
          onClick={() => setShowWaterNeed(true)}
          className="bg-card border border-border rounded-lg p-4 flex gap-3 hover:border-primary hover:bg-primary/5 transition-colors text-left"
        >
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20">
            <Droplet className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm mb-1">Water Need</h3>
            <p className="text-lg font-bold text-blue-500 mb-1">
              Check irrigation requirement
            </p>
            <p className="text-xs text-foreground/60">Water needed for optimal growth</p>
          </div>
        </button>

        {/* AI Insight Card */}
        <button
          onClick={() => setShowInsights(true)}
          className="bg-card border border-border rounded-lg p-4 flex gap-3 hover:border-primary hover:bg-primary/5 transition-colors text-left"
        >
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/20">
            <Brain className="w-6 h-6 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm mb-1">Field Insights</h3>
            <p className="text-lg font-bold text-purple-500 mb-1">
              View Current Conditions
            </p>
            <p className="text-xs text-foreground/60">Detailed analysis of your field</p>
          </div>
        </button>
      </div>

      {/* Status Info */}
      <div className="bg-green-600/20 border border-green-600 rounded-lg p-3 text-center">
        <p className="text-sm font-semibold text-green-400">All systems nominal</p>
      </div>

      {/* Field Insights Modal */}
      {showInsights && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background w-11/12 rounded-lg p-4 max-h-[100vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Field Condition Insights</h2>
              <button
                onClick={() => setShowInsights(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <p className="text-sm text-foreground/80 leading-relaxed">
                Soil moisture at {fieldInsights.soilMoisture.current}% is declining and requires irrigation within 6 hours. Temperature of {fieldInsights.temperature.current}{fieldInsights.temperature.unit} is optimal, humidity at {fieldInsights.humidity.current}% supports healthy growth.</p>
            </div>

            <button
              onClick={() => setShowInsights(false)}
              className="w-full bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Water Need Modal */}
      {showWaterNeed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background w-11/12 rounded-lg p-4 max-h-[100vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Water Need</h2>
              <button
                onClick={() => setShowWaterNeed(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                Water needed to irrigate:
              </p>
              <div className="flex items-center gap-3">
                <Droplet className="w-8 h-8 text-blue-500" />
                <p className="text-3xl font-bold text-blue-500">{waterNeeded} L</p>
              </div>
            </div>

            <button
              onClick={() => setShowWaterNeed(false)}
              className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-semibold hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
