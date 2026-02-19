"use client";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const performanceData = [
  { month: "Jan", value: 85 },
  { month: "Feb", value: 72 },
  { month: "Mar", value: 78 },
  { month: "Apr", value: 40 },
  { month: "May", value: 88 },
  { month: "Jun", value: 76 },
  { month: "Jul", value: 45 },
  { month: "Aug", value: 90 },
  { month: "Sept", value: 75 },
  { month: "Oct", value: 48 },
  { month: "Nov", value: 92 },
  { month: "Dec", value: 80 },
];
export default function PerformanceSection() {
  const radius = 100;
  const circumference = Math.PI * radius; // semi-circle
  const progress = 80; // %
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-30 ">
      {/* 12 Month Performance */}
      <div className="bg-white rounded-xl border border-[#E0E8ED]  pt-4  shadow-sm lg:col-span-2  ">
        <h3 className="text-[16px] font-bold text-[#1D3557] mb-4 px-4">
          12-Month Performance
        </h3>

        <div className="h-[260px] ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              barCategoryGap="8%"
              margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0078D7" stopOpacity={1} />
                  <stop offset="60%" stopColor="#0078D7" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#0078D7" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#EEF2F6" vertical={false} />

              <XAxis
                dataKey="month"
                tick={{ fill: "#8597A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tick={{ fill: "#8597A8", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#E6EDF5", strokeWidth: 1 }}
              />

              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audit Readiness */}
      <div className="bg-white rounded-xl border border-[#E0E8ED] shadow-sm h-[322px]  flex flex-col relative">
        {/* Header */}
        <div className="px-4 pt-4">
          <h3 className="text-[16px] font-bold text-[#1D3557]">
            Audit Readiness
          </h3>
        </div>

        {/* Graph + Stats Wrapper (Fixed 260px like Figma) */}
        <div className="h-[260px] flex flex-col justify-between">
          {/* Graph */}
          <div className="relative w-full max-w-[400px] aspect-[2/1] mx-auto">
            <svg
              viewBox="0 0 260 160"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background Arc */}
              <path
                d="M 30 140 A 100 100 0 0 1 230 140"
                fill="none"
                stroke="#E6EBF0"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Progress Arc */}
              <path
                d="M 30 140 A 100 100 0 0 1 230 140"
                fill="none"
                stroke="#2E9B4F"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center top-[52px]">
              <span className="text-[clamp(32px,4vw,44px)] font-bold text-[#1D3557]">
                {progress}%
              </span>
              <span className="text-[clamp(12px,1.2vw,14px)] text-[#8597A8] mt-1">
                Readiness Level
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E0E8ED] mx-6" />

          {/* Bottom Stats */}
          <div className="flex justify-between px-10 pb-4">
            <div className="text-center">
              <p className="text-[22px] font-bold text-[#1D3557]">12</p>
              <p className="text-[13px] text-[#8597A8] mt-1">Overdue Tasks</p>
            </div>

            <div className="text-center">
              <p className="text-[22px] font-bold text-[#1D3557]">5</p>
              <p className="text-[13px] text-[#8597A8] mt-1">
                Missing Evidence
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
