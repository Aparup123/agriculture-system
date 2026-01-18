"use client"
import {useEffect, useState} from 'react'
import {socket} from '@/util/socket'
export default function Home() {
  const [sensorData, setSensorData] = useState<string>();
  const [pumpOn, setPumpOn]=useState<boolean>();
  
  useEffect(()=>{
    const onSensorData=(data:{data:string})=>{
      console.log(data)
      setSensorData(data.data)
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
    <div>
      {sensorData}
      <h1>Pump</h1>
      {(pumpOn==true)?<button onClick={turnPumpOff}>Turn Off</button>:<button onClick={turnPumpOn}>Turn On</button>}
    </div>
  );
}
