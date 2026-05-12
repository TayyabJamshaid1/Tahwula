"use client";

import DashboardStatsSection from "@/app/simpleUser/dashboard/components/DashboardStatsSection";
import OverallCompilanceSection from "@/app/simpleUser/dashboard/components/OverallCompilanceSection";
import PerformanceSection from "@/app/simpleUser/dashboard/components/PerformanceSection";
import PerformingPerspectiveLeaders from "@/app/simpleUser/dashboard/components/PerformingPerspectiveLeaders";
import ProgressBarSection from "@/app/simpleUser/dashboard/components/ProgressBarSection";
import ProgressData from "@/app/simpleUser/dashboard/components/ProgressStatus";
import RecentActivities from "@/app/simpleUser/dashboard/components/RecentActivities";

export default function Page() {
  return (
    <div className="w-full bg-[#f5f6f8] p-4 sm:p-6">
      <div className=" space-y-6">
        {/* Timeline */}
        <ProgressBarSection />

        {/* Stats Cards */}
        <DashboardStatsSection />
      </div>
      <ProgressData/>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 py-4">
        <div className="lg:col-span-2 xl:col-span-1">

        <OverallCompilanceSection />
        </div>

        {/*second section*/}
        <PerformingPerspectiveLeaders />

        {/* RECENT ACTIVITIES */}
        <RecentActivities />
      </div>
      <PerformanceSection />
    </div>
  );
}
