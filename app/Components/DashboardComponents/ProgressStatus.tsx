"use client";

import { Card, CardContent } from "@/components/ui/card";

/* ================= COLORS ================= */

const COLORS = {
  headerBlue: "#1D3557",
  green: "#1EA54E",
  orange: "#F59F0A",
  violet: "#8597A8",
  blue: "#0078D7",
  red: "#F50A0A",
};

/* ================= DATA ================= */

const columns = [
  {
    title: "Strategy And Planning",
    percent: "97.78%",
    sections: [
      { name: "Digital Transformation", nums: [1, 2, 3] },
      { name: "Digital Governance", nums: [1, 2, 3] },
      { name: "Enterprise Architecture", nums: [1, 2] },
    ],
  },
  {
    title: "Organization And Culture",
    percent: "70.83%",
    sections: [
      { name: "Digital Culture", nums: [1, 2, 3] },
      { name: "Leadership Development", nums: [1, 2, 3] },
      { name: "Skills Capacity Building", nums: [1, 2, 3] },
    ],
  },
  {
    title: "Operations And Execution",
    percent: "80.00%",
    sections: [{ name: "Business Processes", nums: [1, 2, 3] }],
  },
  {
    title: "Business Continuity",
    percent: "90.59%",
    sections: [
      { name: "IT Infrastructure", nums: [1, 2, 3] },
      { name: "Business Continuity", nums: [1, 2, 3] },
      { name: "Cloud Infrastructure", nums: [1, 2, 3] },
    ],
  },
  {
    title: "Information Technology",
    percent: "75.00%",
    sections: [
      { name: "Software Platforms", nums: [1, 2, 3] },
      { name: "Cloud Infrastructure", nums: [1, 2, 3] },
    ],
  },
  {
    title: "Comprehensive Governance",
    percent: "64.44%",
    sections: [{ name: "Governance Platforms", nums: [1, 2, 3] }],
  },
  {
    title: "Channels And Services",
    percent: "100%",
    sections: [
      { name: "Digital Channels", nums: [1, 2, 3] },
      { name: "User Experience", nums: [1, 2, 3] },
      { name: "Open Data", nums: [1, 2, 3] },
    ],
  },
  {
    title: "Beneficiary Centralization",
    percent: "60.00%",
    sections: [
      { name: "Creative Solutions", nums: [1, 2, 3] },
      { name: "Creative Solutions", nums: [1, 2, 3] },
      { name: "Creative Solutions", nums: [1, 2, 3] },
    ],
  },
  {
    title: "Government Data",
    percent: "87.50%",
    sections: [
      { name: "Data Governance", nums: [1, 2, 3] },
      { name: "Open Data", nums: [1, 2, 3] },
      { name: "Innovation", nums: [1, 2, 3] },
    ],
  },
  {
    title: "Research And Innovation",
    percent: "17.65%",
    sections: [
      { name: "Creative Solutions", nums: [1, 2, 3] },
      { name: "Innovation", nums: [1, 2, 3] },
      { name: "Research", nums: [1, 2, 3] },
    ],
  },
];

/* ================= HEADER ================= */

function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-[16px] font-bold text-[#1D3557]">Progress Status</h1>

      <div className="flex gap-6 text-sm text-gray-600 flex-wrap">
        <Legend color="bg-[#8597A8]" label="Not Started" />
        <Legend color="bg-[#F59F0A]" label="In Progress" />
        <Legend color="bg-[#1EA54E]" label="Completed" />
        <Legend color="bg-[#004479]" label="Partially Uploaded" />
        <Legend color="bg-[#0078D7]" label="Fully Uploaded" />
        <Legend color="bg-[#F50A0A]" label="Delayed" />
      </div>
    </div>
  );
}

function Legend({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

/* ================= BLUE CARD ================= */

function BlueCard({ title, percent }: any) {
  return (
    <div
      className="
        rounded-[10px]
        text-white
        text-center
        shadow-sm
        h-[85px]
        flex flex-col items-center justify-center
        gap-1.5
      "
      style={{ background: COLORS.headerBlue }}
    >
      <p className="text-sm font-bold leading-tight px-2">{title}</p>
      <div className="bg-[#FFFFFF1A] w-16 h-6 flex justify-center items-center rounded-full">
        <p className="text-[14px] font-bold">{percent}</p>
      </div>
    </div>
  );
}

/* ================= NUMBER BADGE ================= */

function Number({ n }: { n: number }) {
  let color = COLORS.green;

  if (n === 2) color = COLORS.orange;
  if (n === 3) color = COLORS.blue;
  if (n === 4) color = COLORS.violet;
  if (n === 5) color = COLORS.red;

  return (
    <div
      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-medium"
      style={{ background: color }}
    >
      {n}
    </div>
  );
}

/* ================= SECTION CARD ================= */

function Section({ data }: any) {
  return (
    <Card className="rounded-[10px] shadow-sm border border-[#E0E8ED] bg-[#F5F8FB] h-full">
      <CardContent className="p-3 h-full flex flex-col">
        <p className="text-[11px] font-medium text-gray-700 mb-2">
          {data.name}
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {data.nums.map((n: number) => (
            <Number key={n} n={n} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ================= COLUMN ================= */

function Column({ col }: any) {
  const sectionCount = col.sections.length;

  // Calculate height distribution based on number of sections
  const getSectionHeightClass = () => {
    if (sectionCount === 1) return "h-full"; // Full height for 1 section
    if (sectionCount === 2) return "h-[calc(50%-6px)]"; // Half height minus gap
    if (sectionCount === 3) return "h-[calc(33.333%-8px)]"; // Third height minus gap
    return "h-auto"; // Default
  };

  return (
    <div className="flex flex-col h-full">
      {/* Blue Card - fixed height */}
      <div className="h-[85px] mb-3">
        <BlueCard title={col.title} percent={col.percent} />
      </div>

      {/* Sections Container */}
      <div
        className={`flex-1 flex flex-col ${sectionCount > 1 ? "gap-3" : ""}`}
      >
        {col.sections.map((s: any, i: number) => (
          <div
            key={i}
            className={sectionCount > 1 ? getSectionHeightClass() : "flex-1"}
          >
            <Section data={s} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function ProgressStatus() {
  return (
    <div className="p-5 bg-white border border-gray-200 rounded-[10px] max-w-full h-full">
      <Header />

      <div
        className="
          grid
          gap-4
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-10
          h-[calc(100%-60px)]
        "
      >
        {columns.map((col, i) => (
          <div key={i} className="h-full">
            <Column col={col} />
          </div>
        ))}
      </div>
    </div>
  );
}
