"use client";
import IrrigationControl from "@/components/IrrigationControl";
import IrrigationHistory from "@/components/IrrigationHistory";
import IrrigationSuggestion from "@/components/IrrigationSuggestion";



export default function Irrigation() {
  return (
    <div className="flex">
        <div className="flex-1 p-2">
        <IrrigationHistory />
        </div>
        <div className="flex flex-col flex-2 gap-5">
            <IrrigationControl/>
            <IrrigationSuggestion/>
              
        </div>

    </div>
  )
}
