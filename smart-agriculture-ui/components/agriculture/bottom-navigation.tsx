'use client'

import { Home, Gauge as Gauge2, Sparkles, Settings } from 'lucide-react'

interface BottomNavigationProps {
  currentScreen: 'home' | 'sensors' | 'ai' | 'controls'
  onNavigate: (screen: 'home' | 'sensors' | 'ai' | 'controls') => void
}

export default function BottomNavigation({
  currentScreen,
  onNavigate,
}: BottomNavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'sensors', label: 'Sensors', icon: Gauge2 },
    { id: 'ai', label: 'AI', icon: Sparkles },
    { id: 'controls', label: 'Controls', icon: Settings },
  ]

  return (
    <div className="border-r border-border bg-card w-20">
      <div className="flex flex-col items-center justify-start h-full pt-4 ">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as 'home' | 'sensors' | 'ai' | 'controls')}
              className={`flex flex-col items-center justify-center w-full py-4 gap-1 transition-colors ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
