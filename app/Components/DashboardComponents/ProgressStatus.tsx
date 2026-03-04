"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

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
      {
        name: "Digital Transformation",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#1EA54E" },
        ],
      },
      {
        name: "Digital Governance",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#F59F0A" },
        ],
      },
      {
        name: "Enterprise Architecture",
        align: "bottom",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#1EA54E" },
          { tnumber: 4, color: "#1EA54E" },
        ],
      },
    ],
  },
  {
    title: "Organization And Culture",
    percent: "70.83%",
    sections: [
      {
        name: "Digital Culture",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#F59F0A" },
          { tnumber: 3, color: "#1EA54E" },
        ],
      },
      {
        name: "Leadership Development",
        align: "bottom",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#1EA54E" },
          { tnumber: 4, color: "#1EA54E" },
        ],
      },
      {
        name: "Skills Capacity Building",
        align: "center",
        nums: [
          { tnumber: 1, color: "#F59F0A" },
          { tnumber: 2, color: "#F59F0A" },
          { tnumber: 3, color: "#F59F0A" },
        ],
      },
    ],
  },
  {
    title: "Operations And Execution",
    percent: "80.00%",
    sections: [
      {
        name: "Business Processes",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#F59F0A" },
          { tnumber: 3, color: "#F59F0A" },
          { tnumber: 4, color: "#1EA54E" },
        ],
      },
    ],
  },
  {
    title: "Business Continuity",
    percent: "90.59%",
    sections: [
      {
        name: "Risk Management",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#1EA54E" },
          { tnumber: 4, color: "#1EA54E" },
          { tnumber: 5, color: "#1EA54E" },
        ],
      },
      {
        name: "Business Continuity",
        align: "bottom",
        nums: [
          { tnumber: 1, color: "#8597A8" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#8597A8" },
          { tnumber: 4, color: "#1EA54E" },
          { tnumber: 5, color: "#8597A8" },
          { tnumber: 6, color: "#1EA54E" },
          { tnumber: 7, color: "#1EA54E" },
        ],
      },
    ],
  },
  {
    title: "Information Technology",
    percent: "75.00%",
    sections: [
      {
        name: "Support Systems",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#1EA54E" },
          { tnumber: 4, color: "#1EA54E" },
          { tnumber: 5, color: "#1EA54E" },
        ],
      },
      {
        name: "IT Infrastructure",
        align: "bottom",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#0078D7" },
          { tnumber: 4, color: "#1EA54E" },
          { tnumber: 5, color: "#1EA54E" },
          { tnumber: 6, color: "#0078D7" },
          { tnumber: 7, color: "#1EA54E" },
        ],
      },
      {
        name: "Cloud Infrastructure",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#0078D7" },
        ],
      },
    ],
  },
  {
    title: "Comprehensive Governance",
    percent: "64.44%",
    sections: [
      {
        name: "Governance Platforms",
        align: "bottom",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#1EA54E" },
          { tnumber: 4, color: "#8597A8" },
          { tnumber: 5, color: "#1EA54E" },
          { tnumber: 6, color: "#1EA54E" },
          { tnumber: 7, color: "#1EA54E" },
          { tnumber: 8, color: "#1EA54E" },
          { tnumber: 9, color: "#1EA54E" },
        ],
      },
    ],
  },
  {
    title: "Channels And Services",
    percent: "100%",
    sections: [
      {
        name: "Service Quality",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#1EA54E" },
        ],
      },
      {
        name: "Digital Channels",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#1EA54E" },
          { tnumber: 4, color: "#1EA54E" },
        ],
      },
    ],
  },
  {
    title: "Beneficiary Centralization",
    percent: "60.00%",
    sections: [
      {
        name: "User Engagement",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#F59F0A" },
          { tnumber: 3, color: "#F59F0A" },
          { tnumber: 4, color: "#F59F0A" },
        ],
      },
      {
        name: "User Relationship",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#F59F0A" },
          { tnumber: 3, color: "#F59F0A" },
        ],
      },
      {
        name: "User Experience",
        align: "bottom",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#F59F0A" },
          { tnumber: 3, color: "#1EA54E" },
          { tnumber: 4, color: "#F59F0A" },
          { tnumber: 5, color: "#1EA54E" },
        ],
      },
    ],
  },
  {
    title: "Government Data",
    percent: "87.50%",
    sections: [
      {
        name: "Data Governance",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#F59F0A" },
          { tnumber: 3, color: "#F59F0A" },
        ],
      },
      {
        name: "Data Usage & Availability",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#F59F0A" },
          { tnumber: 3, color: "#F59F0A" },
        ],
      },
      {
        name: "Open Data",
        align: "center",
        nums: [
          { tnumber: 1, color: "#1EA54E" },
          { tnumber: 2, color: "#1EA54E" },
          { tnumber: 3, color: "#F59F0A" },
        ],
      },
    ],
  },
  {
    title: "Research And Innovation",
    percent: "17.65%",
    sections: [
      {
        name: "Innovation",
        align: "bottom",
        nums: [
          { tnumber: 1, color: "#F50A0A" },
          { tnumber: 2, color: "#F50A0A" },
          { tnumber: 3, color: "#F50A0A" },
          { tnumber: 4, color: "#F50A0A" },
        ],
      },
      {
        name: "Creative Solutions",
        align: "center",
        nums: [
          { tnumber: 1, color: "#F59F0A" },
          { tnumber: 2, color: "#F50A0A" },
        ],
      },
    ],
  },
];

/* ================= CONFIGURATION ================= */
// Sections that should display 3 numbers per row
const THREE_PER_ROW_SECTIONS = [
  "Digital Transformation",
  "Digital Culture",
  "Digital Governance",
  "Support Systems",
  "IT Infrastructure",
  "Cloud Infrastructure",
  "Data Governance",
  "Data Usage & Availability",
  "Open Data",
  "User Relationship",
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
      className="rounded-[10px] text-white text-center shadow-sm h-[94px] flex flex-col items-center justify-between pt-4 pb-3"
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
function Number({ item }: any) {
  return (
    <div
      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-medium shrink-0"
      style={{ background: item.color }}
    >
      {item.tnumber}
    </div>
  );
}

/* ================= SECTION CARD ================= */
function Section({ data }: any) {
  // Check if this section should display 3 numbers per row
  const shouldUseThreePerRow = THREE_PER_ROW_SECTIONS.includes(data.name);
  const itemsPerRow = shouldUseThreePerRow ? 3 : 2;
  
  // Group numbers into rows based on itemsPerRow
  const rows: any[] = [];
  for (let i = 0; i < data.nums.length; i += itemsPerRow) {
    rows.push(data.nums.slice(i, i + itemsPerRow));
  }

  return (
    <Card className="rounded-[10px] shadow-sm border border-[#E0E8ED] bg-[#F5F8FB] h-full flex flex-col py-2">
      <CardTitle className="text-[10px] font-normal text-center text-[#1D3557] px-2 shrink-0">
        {data.name}
      </CardTitle>
      <CardContent className="flex-1 flex flex-col justify-center py-1 min-h-[60px]">
        <div className={`flex flex-col gap-1.5 w-full ${data.align === "bottom" ? "justify-end" : "justify-center"} h-full`}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5 justify-center">
              {row.map((item: any, index: number) => (
                <Number key={index} item={item} />
              ))}
            </div>
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
    if (sectionCount === 1) return "h-full";
    if (sectionCount === 2) return "h-[calc(50%-6px)]";
    if (sectionCount === 3) return "h-[calc(33.333%-8px)]";
    return "h-auto";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Blue Card - fixed height */}
      <div className="h-[94px] mb-3">
        <BlueCard title={col.title} percent={col.percent} />
      </div>

      {/* Sections Container */}
      <div className={`flex-1 flex flex-col ${sectionCount > 1 ? "gap-3" : ""}`}>
        {col.sections.map((s: any, i: number) => (
          <div key={i} className={sectionCount > 1 ? getSectionHeightClass() : "flex-1"}>
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
    <div className="mt-4 p-5 bg-white border border-[#E0E8ED] rounded-[10px] max-w-full h-full">
      <Header />
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 h-[calc(100%-60px)]">
        {columns.map((col, i) => (
          <div key={i} className="h-full">
            <Column col={col} />
          </div>
        ))}
      </div>
    </div>
  );
}