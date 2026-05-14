import { ReceiptText } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Lato, Open_Sans, Playwrite_GB_J_Guides } from "next/font/google";



export default function SensorData({sensorData}:{sensorData:SensorData}) {
  
  return (
      <Card className="flex-2 h-full">
        <CardHeader className="">
            <CardTitle className="text-2xl">Field Status</CardTitle> 
        </CardHeader>
        <CardContent className="">
          <ul>
            <li className="flex gap-2 items-center"><span >🌱</span><span>Soil Moisture:{sensorData?.soilMoisture}%</span></li>
            <li className="flex gap-2 items-center"><span >💧</span>Humidity:{sensorData?.humidity}%</li>
            <li className="flex gap-2 items-center"><span >🌡️</span>Temperature:{sensorData?.temperature}°C</li>
            {/* <li className="flex gap-2 items-center"><span ></span>Air Pressure:{sensorData?.airPressure}Pa</li> */}
            {/* <li>Rain:{sensorData?.rainDrop}%</li>
             */}
             <li className="flex gap-2 items-center"><span >🌧️</span>Raining</li>
            
            <li className="flex gap-2 items-center"><span >🔋</span>Battery {sensorData?.battery}%</li>
          </ul>
          </CardContent>
          <CardFooter>
            <Button><ReceiptText /> Details</Button>
          </CardFooter>
      </Card>
  )
}