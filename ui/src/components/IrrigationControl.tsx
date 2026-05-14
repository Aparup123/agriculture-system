"use client";
import { PaintBucket } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";

export default function IrrigationControl() {
  const [irrigationMode, setIrrigationMode] = useState<boolean>(false);
  return (
    <div className="">
      <h1 className="p-2 text-xl font-bold flex items-center gap-2"><PaintBucket />Irrigation Control</h1>
      <div className="flex flex-col gap-2 px-2">
        <div>
          <h2 className="tracking-tight font-bold mb-1">Irrigation Mode</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="irrigationMode">Manual</Label>
            <Switch size="default" id="irrigationMode" onCheckedChange={(s) => setIrrigationMode(s)} checked={irrigationMode} />
            <Label htmlFor="irrigationMode">Automatic</Label>
          </div>
        </div>
        <div>
          <h2 className="tracking-tight font-bold mb-1">Pump</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="irrigationMode">Off</Label>
            <Switch id="irrigationMode" disabled={irrigationMode} />
            <Label htmlFor="irrigationMode">On</Label>
          </div>
        </div>
      </div>
    </div>
  )
}