'use client';

import { useEffect, useState } from 'react'
import SensorCard from './sensor-card'
import StatusBadge from './status-badge'
import { set } from 'react-hook-form';
import { socket } from '@/util/socket';

interface HomeScreenProps {
  onSensorSelect: (sensorId: string) => void
}

export default function HomeScreen({ onSensorSelect }: HomeScreenProps) {
  const fieldStatus = 'GOOD'
  const initialSensorData={
    soilMoisture:0,
    rainDrop:0,
    humidity:0,
    temperature:0,
    tempFromBmp:0,
    altitude:0,
    airPressure:0,
    battery:0
  }
  
  // const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);
 
  const [sensors, setSensors] = useState([
    { id: 'temp', label: 'Temperature', value: 28, unit: '°C', status: 'good' },
    { id: 'humidity', label: 'Humidity', value: 65, unit: '%', status: 'good' },
    { id: 'moisture', label: 'Soil Moisture', value: 42, unit: '%', status: 'warning' },
    { id: 'rain', label: 'Rain Status', value: 'No Rain', unit: '', status: 'critical' },
  ])

  const [pumpStatus, setPumpStatus] = useState('OFF')
    
    useEffect(() => {
      const onSensorData = (payload: { data: string }) => {
      const sensorDataList = payload.data.split(",")
      const sensorDataObj: SensorData = {
        soilMoisture: Number(sensorDataList[0]),
        rainDrop: Number(sensorDataList[1]),
        humidity: Number(sensorDataList[2]),
        temperature: Number(sensorDataList[3]),
        tempFromBmp: Number(sensorDataList[4]),
        altitude: Number(sensorDataList[5]),
        airPressure: Number(sensorDataList[6]),
        battery: Number(sensorDataList[7]),
      }
      const sensorData=sensorDataObj

      console.log("data changed");
      setSensors([
          { id: 'temp', label: 'Temperature', value: sensorData.temperature, unit: '°C', status: 'good' },
          { id: 'humidity', label: 'Humidity', value: sensorData.humidity, unit: '%', status: 'good' },
          { id: 'moisture', label: 'Soil Moisture', value: sensorData.soilMoisture, unit: '%', status: sensorData.soilMoisture > 70 ? 'good' : (sensorData.soilMoisture > 40 ? 'warning' : 'critical') },
          { id: 'rain', label: 'Rain Status', value: sensorData.rainDrop === 1 ? 'Raining' : 'No Rain', unit: '', status: sensorData.rainDrop === 1 ? 'critical' : 'good' },
        ]);
    }

    const onPumpStatus = (payload: { status: string }) => {
      setPumpStatus(payload.status.toUpperCase())
    }

    socket.on("sensor_data", onSensorData)
    socket.on("pump_status", onPumpStatus)
    
    return () => {
      socket.off("sensor_data", onSensorData)
      socket.off("pump_status", onPumpStatus)
    }
  }, [])

  return (
    <div className="flex flex-col p-4 gap-4 bg-background">
      {/* Header */}
      {/* <div className="text-center">
        <h1 className="text-xl font-bold mb-3">Smart Agriculture</h1>
        <StatusBadge status={fieldStatus} />
      </div> */}

      {/* Sensor Grid */}
      <div className="grid grid-cols-3 gap-3">
        {sensors.map((sensor) => (
          <SensorCard
            key={sensor.id}
            id={sensor.id}
            label={sensor.label}
            value={sensor.value}
            unit={sensor.unit}
            status={sensor.status as 'good' | 'warning' | 'critical'}
            onClick={() => onSensorSelect(sensor.id)}
          />
        ))}
        {/* Pump Status Card */}
        <div className="bg-card border border-border rounded-lg p-3 shadow-sm">
          <div className="flex flex-col items-center justify-between"><div className={`w-10 h-10 mb-3 rounded-full flex items-center justify-center ${
              pumpStatus === 'ON' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white text-xl font-bold">
                {pumpStatus === 'ON' ? '✓' : '✕'}
              </span>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <p className="text-sm font-medium text-muted-foreground">Pump Status</p>
              <p className="text-xl font-bold mt-1">{pumpStatus}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
