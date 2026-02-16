"use client";

import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import StatCard from "@/app/Components/StatCard";
import OverviewPage from "@/app/Components/OverviewPage";
import EvidencePage from "@/app/Components/EvidencePage";
const statsData = [
  { id: 1, imageName: "FourimageLogo.png", label: "Total Evidence", number: 4 },
  {
    id: 2,
    imageName: "ThirdimageLogo.png",
    label: "Under Review Evidence",
    number: 3,
  },
  {
    id: 3,
    imageName: "TwoimageLogo.png",
    label: "In Progress Evidence",
    number: 2,
  },
  {
    id: 4,
    imageName: "OneimageLogo.png",
    label: "Completed Evidence",
    number: 1,
  },
];

export default function Perspective() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 bg-[#F5F8FA] min-h-screen">
      <div className="flex items-center gap-2 text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" />
        <h1 className="text-[16px] font-bold">
          Digital Transformation Strategic Planning
        </h1>
      </div>

      {/* Main Strategy Card */}
      <div className="bg-white rounded-xl border border-[#E0E8ED] p-3 flex flex-col lg:flex-row justify-center gap-4 lg:gap-0 lg:justify-between items-center shadow-sm">
        <div className="flex flex-col justify-center items-center lg:justify-start lg:items-start">
          <span className="w-31 h-7 flex items-center justify-center  text-wrap text-xs text-center  rounded-full bg-[#E0E8ED] text-[#8597A8]">
            Strategy & Planning
          </span>

          <span className="text-[16px] font-bold mt-1 text-[##1D3557] text-center lg:text-left">
            Digital Transformation Strategic Planning
          </span>

          <p className="text-sm font-normal text-[#8597A8] mt-1 pr-2 text-wrap text-center lg:text-left ">
            Develop Comprehensive Strategic Plans For Digital Transformation
            Aligned With Organizational Goals
          </p>
        </div>

        {/* Progress Circle */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-8 border-[#1EA54E] flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">100%</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            number={stat.number}
            imageName={stat.imageName}
            label={stat.label}
          />
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue={activeTab}
        className="my-4 flex justify-center items-center md:items-start"
        onValueChange={setActiveTab}
      >
        <TabsList className="h-[40px] w-[225px] bg-[#E0E8ED80]  rounded-lg">
          <TabsTrigger
            value="overview"
            className="
        text-[14px] font-normal
        text-[#8597A8]
        data-[state=active]:bg-white
        data-[state=active]:text-[#1D3557]
        data-[state=active]:shadow-sm
        rounded-md
      "
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="evidence"
            className="
        text-[14px] font-normal
        text-[#8597A8]
        data-[state=active]:bg-white
        data-[state=active]:text-[#1D3557]
        data-[state=active]:shadow-sm
        rounded-md
      "
          >
            Evidence
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewPage />}

      {activeTab === "evidence" && <EvidencePage />}
    </div>
  );
}
