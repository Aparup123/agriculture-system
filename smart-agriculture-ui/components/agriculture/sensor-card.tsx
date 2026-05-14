'use client'

import { Droplet, Wind, CloudRain, Thermometer } from 'lucide-react'

interface SensorCardProps {
  id: string
  label: string
  value: string | number
  unit: string
  status: 'good' | 'warning' | 'critical'
  onClick: () => void
}

export default function SensorCard({
  id,
  label,
  value,
  unit,
  status,
  onClick,
}: SensorCardProps) {
  const getIcon = () => {
    const iconClass = 'w-10 h-10'
    switch (id) {
      case 'temp':
        return <Thermometer className={iconClass} />
      case 'humidity':
        return <Wind className={iconClass} />
      case 'moisture':
        return <Droplet className={iconClass} />
      case 'rain':
        return <CloudRain className={iconClass} />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'bg-green-600 border-green-500'
      case 'warning':
        return 'bg-yellow-500 border-yellow-400'
      case 'critical':
        return 'bg-red-600 border-red-500'
      default:
        return 'bg-card border-border'
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all active:scale-65 ${getStatusColor()}`}
    >
      <div className="text-white mb-2">{getIcon()}</div>
      <div className="text-xs font-semibold text-center mb-1 text-white line-clamp-1">
        {label}
      </div>
      <div className="text-lg font-bold text-white">
        {value}
        <span className="text-sm ml-1">{unit}</span>
      </div>
    </button>
  )
}
