"use client"
import { useEffect, useState } from 'react'
import { socket } from '@/util/socket'
import { Button } from '@/components/ui/button';
import SensorData from '@/components/SensorData';
import { BotMessageSquare, PaintBucket } from 'lucide-react';
import Link from 'next/link';




export default function Home() {
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
  const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);
  const [pumpOn, setPumpOn] = useState<boolean>();

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
      setSensorData(sensorDataObj)
    }

    socket.on("sensor_data", onSensorData)

    return () => {
      socket.off("sensor_data", onSensorData)
    }
  }, [])

  const turnPumpOn = () => {
    socket.emit("pump_state", "on")
    setPumpOn(true)
  }
  const turnPumpOff = () => {
    socket.emit("pump_state", "off")
    setPumpOn(false)
  }

  return (
    <div className='p-2 text-lg'>
      <div className='flex gap-2'>
        <SensorData sensorData={sensorData}/>
        <div className='flex-1 flex flex-col justify-around'>
          <Link href={"/irrigation"}><Button className='p-8 text-xl'><PaintBucket />Irrigation</Button></Link>
          <Button className='text-xl p-8'><BotMessageSquare />AI Insights</Button>
          {<Button className='text-xl p-8' onClick={(pumpOn == true) ? turnPumpOff : turnPumpOn}>{(pumpOn == true) ? "Turn Off" : "Turn On"}</Button>}
        </div>
      </div>
    </div>
  );
}
