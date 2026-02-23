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
      { name: "Leadership Development", nums: [1, 2, 3, 4] },
      { name: "Skills Capacity Building", nums: [1, 2, 3] },
    ],
  },

  /* duplicate until 10 columns */
  ...Array(8).fill({
    title: "Information Technology",
    percent: "75.00%",
    sections: [{ name: "Support Systems", nums: [1, 2, 3, 4, 5] }],
  }),
];

/* ================= HEADER ================= */

function Header() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[16px] font-bold text-[#1D3557]">Progress Status</h1>

      {/* Legend EXACT */}
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
      <span className={`w-3 h-3 text-sm rounded-full ${color}`} />
      {label}
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
        h-23
        flex flex-col items-center justify-center
        gap-2
        pt-2
        pb-1
        px-1
      "
      style={{ background: COLORS.headerBlue }}
    >
      <p className="text-sm font-bold leading-tight">{title}</p>
        <div className="bg-[#FFFFFF1A] w-16 h-5.5 flex justify-center items-center rounded-full">
                  <p className="text-[14px] font-bold ">{percent}</p>

        </div>
    </div>
  );
}

/* ================= NUMBER BADGE ================= */

function Number({ n }: { n: number }) {
  let color = COLORS.green;

  if (n === 4) color = COLORS.orange;
  if (n === 5) color = COLORS.blue;

  return (
    <div
      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
      style={{ background: color }}
    >
      {n}
    </div>
  );
}

/* ================= SECTION CARD ================= */

function Section({ data }: any) {
  return (
    <Card className="rounded-xl shadow-sm border-gray-200 bg-[#E0E8ED]">
      <CardContent className="p-4 space-y-3">
        <p className="text-[12px] text-gray-700">{data.name}</p>

        <div className="flex gap-2 flex-wrap">
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
  return (
    <div className="flex flex-col gap-4">
      <BlueCard title={col.title} percent={col.percent} />

      {col.sections.map((s: any, i: number) => (
        <Section key={i} data={s} />
      ))}
    </div>
  );
}

/* ================= MAIN ================= */

export default function ProgressStatus() {
  return (
    <div className="my-5 p-4 space-y-5 bg-white  border border-[#E0E8ED] rounded-[10px] ">
      <Header />

      {/* ⭐ EXACT FIGMA GRID */}
      <div
        className="
          grid
          gap-4
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
          xl:grid-cols-10
        "
      >
        {columns.map((col, i) => (
          <Column key={i} col={col} />
        ))}
      </div>
    </div>
  );
}
