'use client'

import { useState, useEffect } from 'react'
import HomeScreen from '@/components/agriculture/home-screen'
import SensorDetailScreen from '@/components/agriculture/sensor-detail-screen'
import AIRecommendationScreen from '@/components/agriculture/ai-recommendation-screen'
import ControlsScreen from '@/components/agriculture/controls-screen'
import BottomNavigation from '@/components/agriculture/bottom-navigation'

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<'home' | 'sensors' | 'ai' | 'controls'>('home')
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSensorSelect = (sensorId: string) => {
    setSelectedSensor(sensorId)
    setCurrentScreen('sensors')
  }

  const handleBack = () => {
    setSelectedSensor(null)
    setCurrentScreen('home')
  }

  const handleNavigate = (screen: 'home' | 'sensors' | 'ai' | 'controls') => {
    if (screen === 'sensors' && !selectedSensor) {
      // If navigating to sensors without a selected sensor, show the first one
      setSelectedSensor('temp')
    }
    setCurrentScreen(screen)
  }

  if (!isClient) {
    return (
      <div className="h-screen w-full flex flex-col bg-background text-foreground" />
    )
  }

  return (
    <div className="h-screen w-full flex flex-row bg-background text-foreground">
      {/* Left Navigation */}
      <BottomNavigation
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden mr-4">
        {currentScreen === 'home' && (
          <HomeScreen onSensorSelect={handleSensorSelect} />
        )}
        {currentScreen === 'sensors' && selectedSensor && (
          <SensorDetailScreen 
            sensorId={selectedSensor} 
            onBack={() => setCurrentScreen('home')}
            onSensorChange={setSelectedSensor}
          />
        )}
        {currentScreen === 'ai' && (
          <AIRecommendationScreen />
        )}
        {currentScreen === 'controls' && (
          <ControlsScreen />
        )}
      </div>
    </div>
  )
}
