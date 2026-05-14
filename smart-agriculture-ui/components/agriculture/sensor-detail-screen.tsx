'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import SimpleChart from './simple-chart'
import { useState, useEffect } from 'react'

interface SensorDetailScreenProps {
  sensorId: string
  onBack: () => void
  onSensorChange?: (sensorId: string) => void
}

interface SensorData{
  id:string,
  timestamp: string,
  soil_moisture: number,
  rain_status: number,
  humidity:number,
  temperature:number,
  temperature_from_bmp:number,
  altitude:number,
  air_pressure:number,
  battery:number
}

const SENSOR_IDS = ['temp', 'humidity', 'moisture', 'rain']
const API_URL = 'http://localhost:5000'

export default function SensorDetailScreen({
  sensorId,
  onBack,
  onSensorChange,
}: SensorDetailScreenProps) {
  const [sensorDataList, setSensorDataList] = useState<SensorData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sensor data from API
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/latest-sensor-data`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        setSensorDataList(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sensor data');
        console.error('Sensor data fetch error:', err);
        setSensorDataList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
    // Optional: Set up polling to fetch data every 5 seconds
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSensorData = () => {
    // Extract history data from the fetched sensor data list
    const history: number[] = sensorDataList
      ?.map(item => {
        switch (sensorId) {
          case 'temp':
            return item.temperature;
          case 'humidity':
            return item.humidity;
          case 'moisture':
            return item.soil_moisture;
          case 'rain':
            return item.rain_status;
          default:
            return 0;
        }
      })
      .reverse() || [];

    const currentValue = history.length > 0 ? history[history.length - 1] : 0;

    const data: Record<
      string,
      {
        label: string
        value: string | number
        unit: string
        status: string
        history: number[]
      }
    > = {
      temp: {
        label: 'Temperature',
        value: currentValue,
        unit: '°C',
        status: currentValue > 25 ? 'Warm' : currentValue > 15 ? 'Optimal' : 'Cool',
        history: history.length > 0 ? history : [0],
      },
      humidity: {
        label: 'Humidity',
        value: currentValue,
        unit: '%',
        status: currentValue > 70 ? 'High humidity' : currentValue > 40 ? 'Moderate' : 'Low humidity',
        history: history.length > 0 ? history : [0],
      },
      moisture: {
        label: 'Soil Moisture',
        value: currentValue,
        unit: '%',
        status: currentValue > 60 ? 'Wet' : currentValue > 30 ? 'Optimal' : 'Dry',
        history: history.length > 0 ? history : [0],
      },
      rain: {
        label: 'Rain Status',
        value: currentValue === 0 ? 'No Rain' : 'Raining',
        unit: '',
        status: currentValue === 0 ? 'Clear conditions' : 'Rainy conditions',
        history: history.length > 0 ? history : [0],
      },
    };
    return data[sensorId] || data.temp;
  }

  const sensor = getSensorData()
  const currentIndex = SENSOR_IDS.indexOf(sensorId)
  const prevSensorId = currentIndex > 0 ? SENSOR_IDS[currentIndex - 1] : null
  const nextSensorId = currentIndex < SENSOR_IDS.length - 1 ? SENSOR_IDS[currentIndex + 1] : null

  const handlePrevSensor = () => {
    if (prevSensorId && onSensorChange) {
      onSensorChange(prevSensorId)
    }
  }

  const handleNextSensor = () => {
    if (nextSensorId && onSensorChange) {
      onSensorChange(nextSensorId)
    }
  }

  return (
    <div className="flex flex-col h-full p-4 gap-2 bg-background">
      {/* Header with Back Button */}
      <div className="flex items-center ">
        <button
          onClick={onBack}
          className="px-3  rounded-lg bg-card hover:bg-card/80 transition-colors active:scale-95"
        >
          <ChevronLeft className="w-8 h-8 text-primary" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">{sensor.label}</h1>
        <div className="w-12" />
      </div>

      {/* Main Value Display
      <div className="text-center py-4">
        <div className="text-5xl font-bold text-primary mb-2">
          {sensor.value}
          <span className="text-2xl ml-2">{sensor.unit}</span>
        </div>
        <p className="text-sm text-foreground/70">{sensor.status}</p>
      </div> */}

      {/* Chart or Loading/Error State */}
      <div className="flex-1 min-h-0 bg-card rounded-lg p-4 flex items-center justify-center">
        {loading && !sensorDataList ? (
          <div className="text-center">
            <p className="text-sm text-foreground/70">Loading sensor data...</p>
          </div>
        ) : error && sensorDataList?.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-destructive">{error}</p>
            <p className="text-xs text-foreground/50 mt-2">Make sure the Flask server is running at {API_URL}</p>
          </div>
        ) : (
          <SimpleChart data={sensor.history} />
        )}
      </div>

      {/* Sensor Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handlePrevSensor}
          disabled={!prevSensorId}
          className="flex-1 px-3 py-1 rounded-lg bg-card hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 text-primary mx-auto" />
        </button>
        <div className="text-xs text-foreground/60 px-3 font-semibold">
          {currentIndex + 1} / {SENSOR_IDS.length}
        </div>
        <button
          onClick={handleNextSensor}
          disabled={!nextSensorId}
          className="flex-1 px-3 py-1 rounded-lg bg-card hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
        >
          <ChevronRight className="w-6 h-6 text-primary mx-auto" />
        </button>
      </div>
    </div>
  )
}
