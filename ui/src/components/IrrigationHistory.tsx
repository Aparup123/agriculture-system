import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { History } from "lucide-react"

const irrigationHistories = [
  {
    date: "01-08",
    start: "06:00",
    end: "06:30",
    amount: "15",
  },
  {
    date: "02-08",
    start: "06:00",
    end: "06:45",
    amount: "20",
  },
  {
    date: "03-08",
    start: "06:15",
    end: "06:45",
    amount: "18",
  },
  {
    date: "04-08",
    start: "06:00",
    end: "06:30",
    amount: "15",
  },
  {
    date: "05-08",
    start: "06:10",
    end: "06:40",
    amount: "17",
  },
  {
    date: "06-08",
    start: "06:00",
    end: "06:30",
    amount: "15",
  },
  {
    date: "07-08",
    start: "06:20",
    end: "06:50",
    amount: "19",
  },
  {
    date: "08-08",
    start: "06:00",
    end: "06:35",
    amount: "16",
  },
  {
    date: "09-08",
    start: "06:15",
    end: "06:45",
    amount: "18",
  },
  {
    date: "10-08",
    start: "06:05",
    end: "06:40",
    amount: "17",
  },
  {
    date: "11-08",
    start: "06:00",
    end: "06:30",
    amount: "15",
  },
  {
    date: "12-08",
    start: "06:10",
    end: "06:45",
    amount: "20",
  },
  {
    date: "13-08",
    start: "06:00",
    end: "06:35",
    amount: "16",
  },
  {
    date: "14-08",
    start: "06:25",
    end: "06:55",
    amount: "19",
  },
  {
    date: "15-08",
    start: "06:00",
    end: "06:40",
    amount: "18",
  },
]

export default function IrrigationHistory() {
  return (
    <div className="h-[300px] flex flex-col border mb-4 rounded-md">
      <h1 className="p-2 text-xl tracking-tight font-bold flex items-center gap-1"><History />Irrigation History</h1>
      <Table className="flex flex-col">
        <TableHeader className="sticky top-0 bg-white dark:bg-slate-950 z-10">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="flex-1 overflow-y-auto">
          {irrigationHistories.map((irrigationInfo) => (
            <TableRow key={irrigationInfo.date + "::" + irrigationInfo.start}>
              <TableCell className="font-medium">{irrigationInfo.date}</TableCell>
              <TableCell>{irrigationInfo.start}</TableCell>
              <TableCell>{irrigationInfo.end}</TableCell>
              <TableCell className="text-right">{irrigationInfo.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

  )
}
