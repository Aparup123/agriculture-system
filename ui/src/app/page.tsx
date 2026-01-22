"use client"
import {useEffect, useState} from 'react'
import {socket} from '@/util/socket'
import { Button } from '@/components/ui/button';
export default function Home() {
  const [sensorData, setSensorData] = useState<SensorData>();
  const [pumpOn, setPumpOn]=useState<boolean>();
  
  useEffect(()=>{
    const onSensorData=(payload:{data:string})=>{
      const sensorDataList=payload.data.split(",")
      const sensorDataObj:SensorData={
        soilMoisture:Number(sensorDataList[0]),
        rainDrop:Number(sensorDataList[1]),
        humidity:Number(sensorDataList[2]),
        temperature:Number(sensorDataList[3]),
        tempFromBmp:Number(sensorDataList[4]),
        altitude:Number(sensorDataList[5]),
        airPressure:Number(sensorDataList[6]),
        battery:Number(sensorDataList[7]),
      }
      setSensorData(sensorDataObj)
    }

    socket.on("sensor_data", onSensorData)

    return ()=>{
      socket.off("sensor_data", onSensorData)
    }
  }, [])

  const turnPumpOn=()=>{
    socket.emit("pump_state", "on")
    setPumpOn(true)
  }
  const turnPumpOff=()=>{
    socket.emit("pump_state", "off")
    setPumpOn(false)
  }

  return (
    <div className='p-2'>
      <div className='flex gap-2'>
        <div className='border p-2'>
          <h1>Sensor Data</h1>
          <ul>
            <li>Soil Moisture:{sensorData?.soilMoisture}%</li>
            <li>Humidity:{sensorData?.humidity}%</li>
            <li>Temperature:{sensorData?.temperature}°C</li>
            <li>Air Pressure:{sensorData?.airPressure}Pa</li>
            <li>Rain:{sensorData?.rainDrop}%</li>
            <li>Altitude:{sensorData?.altitude}m</li>
            <li>Battery:{sensorData?.battery}%</li>
          </ul>        
        </div>  
         <div>
        <h1>Pump</h1>
      {<Button className='border-2 p-4' onClick={(pumpOn==true)?turnPumpOff:turnPumpOn}>{(pumpOn==true)?"Turn Off":"Turn On"}</Button>}
      </div>
      </div>
     
      
      <div className='width-full border p-2'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos nam inventore quae earum laudantium voluptatum id, excepturi provident, deleniti sunt, officia culpa debitis. Rerum, totam excepturi! Itaque labore fugit molestias!</div>
    </div>
  );
}
