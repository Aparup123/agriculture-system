'use client'

import { useState } from 'react'
import { Droplet, Plus, Minus, ArrowLeft, MoveLeft, ChevronLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { socket } from '@/util/socket'

export default function ControlsScreen() {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('manual')
  const [pumpOn, setPumpOn] = useState(false)
  const [threshold, setThreshold] = useState(50)

  const incrementThreshold = () => {
    setThreshold((prev) => Math.min(prev + 5, 100))
  }

  const decrementThreshold = () => {
    setThreshold((prev) => Math.max(prev - 5, 0))
  }

  const turnPumpOn = () => {
    socket.emit("pump_state", "on")
    setPumpOn(true)
  }
  const turnPumpOff = () => {
    socket.emit("pump_state", "off")
    setPumpOn(false)
  }

  if (!expanded) {
    return (
      <div className="flex flex-col h-full p-4 gap-2 bg-background mr-2">
        <div>
          <h1 className="text-lg font-bold">Controls</h1>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <Card 
            className="p-3 cursor-pointer hover:border-primary/50 transition-colors" 
            onClick={() => setExpanded(true)}
          >
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20">
                <Droplet className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm">Irrigation</h3>
                <p className="text-xs text-foreground/60">Configure system</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Expanded view with tabs
  return (
    <div className="flex flex-col h-full p-2 bg-background">
      {/* Header with back button and pump status */}
      <div className='flex justify-between items-center mb-4'>
        
        
        <button
          onClick={() => setExpanded(false)}
          className="px-2 mr-2 rounded-lg bg-card hover:bg-card/80 transition-colors active:scale-95"
        >
          <ChevronLeft className="w-8 h-8 text-primary" />
        </button>
        <h1 className="text-lg font-bold flex-1 ">Irrigation Control</h1>
        {/* Pump Status - Always visible */}
        <Card className="px-2 py-1 mr-2 mt-1">
            <div className="flex items-center gap-1 w-15">
            <Droplet className={`w-6 h-6 ${pumpOn ? 'text-blue-500' : 'text-foreground/30'}`} />
            <p className="text-xs font-bold">{pumpOn ? 'ON' : 'OFF'}</p>
            </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col mr-2">
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="manual" className="text-xs">Manual</TabsTrigger>
          <TabsTrigger value="automatic" className="text-xs">Automatic</TabsTrigger>
        </TabsList>

        {/* Manual Tab */}
        <TabsContent value="manual" className="flex-1 flex flex-col gap-0 ">
          <Card className="flex-1 p-4 flex flex-col items-center justify-center gap-3 mt-3">
            <Droplet className={`w-12 h-12 ${pumpOn ? 'text-blue-500' : 'text-foreground/30'}`} />
            <div className="text-center">
              <p className="text-xs text-foreground/60 mb-1">Pump Control</p>
              <p className="text-sm font-bold ">{pumpOn ? 'Currently ON' : 'Currently OFF'}</p>
            </div>
            <Button
              onClick={pumpOn ? turnPumpOff : turnPumpOn}
              className={`w-full py-2 text-sm font-bold ${
                pumpOn
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {pumpOn ? 'Turn OFF' : 'Turn ON'}
            </Button>
          </Card>
        </TabsContent>

        {/* Automatic Tab */}
        <TabsContent value="automatic" className="flex-1 flex flex-col gap-0 m-0">
          <Card className="flex-1 p-4 flex flex-col items-center justify-center gap-3 mb-3">
            <div className="text-center w-full">
              <p className="text-xs text-foreground/60 mb-1">Moisture Threshold</p>
              <div className="text-3xl font-bold text-blue-500 mb-2">{threshold}%</div>
              <p className="text-xs text-foreground/60 mb-3">Pump activates below this level</p>
            </div>

            <div className="w-full bg-border rounded-lg h-1.5">
              <div
                className="bg-blue-500 h-full rounded-lg transition-all"
                style={{ width: `${threshold}%` }}
              />
            </div>

            <div className="flex gap-2 w-full">
              <Button
                onClick={decrementThreshold}
                variant="outline"
                className="flex-1 h-8"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                onClick={incrementThreshold}
                variant="outline"
                className="flex-1 h-8"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
