"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function ProgressBarSection() {
  return (
    <div className="bg-white rounded-xl border border-[#E0E8ED] p-4  sm:pt-1.5  overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-[16px] font-bold text-[#1D3557]">
          Project Timeline
        </h2>

        <Select defaultValue="2026">
          <SelectTrigger className="w-full sm:w-[110px] h-[36px] border border-[#E0E8ED] bg-white text-[14px] text-[#1D3557]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="relative min-w-[900px] mt-4.5">
        {/* Progress Line Background */}
        <div className="absolute top-0 left-0 w-full h-[14px] bg-[#E0E8ED] rounded-full" />

        {/* Progress Filled */}
        <div
          className="absolute top-0 left-0 h-[14px] bg-[#1EA54E] rounded-full"
          style={{ width: "28%" }}
        />

        {/* Milestones */}
        <div className="relative flex justify-between items-start">
          {[
            { date: "Mar 17", label: "Kickoff Workshop", active: true },
            { date: "March 18", label: "Data Collection", active: true },
            { date: "May 8", label: "Initial Phase", active: false },
            { date: "May 9–July 12", label: "Verification", active: false },
            { date: "July 13", label: "Completion Reviews", active: false },
            { date: "August 21", label: "Cycle Conclusion", active: false },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center w-[140px]"
            > 
             <div
                className={`w-3.5 h-3.5 rounded-full bg-white ${!item.active && "bg-[#DB1F26]"}`}
               
              />
              {/* <div
                className="w-3.5 h-3.5 rounded-full bg-white"
                style={{
                  border: item.active
                    ? "2px solid #22c55e"
                    : "2px solid #ef4444",
                }}
              /> */}

              <p className="mt-4 text-[14px] font-normal text-[#8597A8] whitespace-nowrap">
                {item.date}
              </p>
              <p className="text-[14px] font-medium text-[#1D3557] whitespace-nowrap">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}