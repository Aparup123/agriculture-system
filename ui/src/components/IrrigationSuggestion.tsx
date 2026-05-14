"use client";
import { Bot } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export default function IrrigationSuggestion() {
  const [aiSuggestion, setAiSuggestion] = useState<string>("Based on the current soil moisture and weather conditions, it is recommended to irrigate the field for 20 minutes to maintain optimal soil moisture levels for crop growth.");
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">Get Suggestion</Button>
        </DialogTrigger>
        <DialogContent className="w-[420px]">
          <DialogHeader>
            <DialogTitle>Suggestion</DialogTitle>
            
          </DialogHeader>
          <div className="grid gap-4">
            <div className="text-justify h-[100px] overflow-y-auto p-2">
              {aiSuggestion}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>
            
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}