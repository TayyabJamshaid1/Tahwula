"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
export default function DashboardStatsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {[
        { value: "78.65%", label: "Overall Progress", icon: "/dashboard1.png" },
        { value: "95", label: "Total Criteria", icon: "/dashboard2.png" },
        { value: "52", label: "Completed Criteria", icon: "/dashboard3.png" },
        { value: "386", label: "Evidence Documents", icon: "/dashboard4.png" },
        {
          value: "302",
          label: "Evidence (Completed)",
          icon: "/dashboard5.png",
        },
        { value: "258", label: "Uploaded To DGA", icon: "/dashboard6.png" },
      ].map((card, index) => (
        <Card
          key={index}
          className="rounded-xl border border-[#E0E8ED] shadow-none p-0"
        >
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between pt-2">
              <div className="text-[24px] font-bold text-[#1D3557]">
                {card.value}
              </div>
              <Image
                src={card.icon}
                alt="Dashboard Toggle Sidebar"
                width={24}
                height={24}
                className="text-white" // Dark icon for light background
              />
            </div>

            <div className="text-[14px] font-normal text-[#8597A8] mt-2">
              {card.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
