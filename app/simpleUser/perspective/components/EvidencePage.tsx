"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
const documents = [
  {
    id: "5.4.1.1",
    name: "Digital_Transformation_Plan.Pdf",
    lead: "Ahmed Khaled",
    preparer: "Ahmed Khaled",
    date: "2025-08-01",
    dueDate: "2025-08-01",
    status: "Approved",
  },
  {
    id: "5.4.1.2",
    name: "KPI_Framework.Xlsx",
    lead: "Mona Hamed",
    preparer: "Mona Hamed",
    date: "2025-08-01",
    dueDate: "2025-08-01",
    status: "Pending Review",
  },
  {
    id: "5.4.1.3",
    name: "Roadmap_Version1.Docx",
    lead: "Rami AlSharif",
    preparer: "Rami AlSharif",
    date: "2025-08-01",
    dueDate: "2025-08-01",
    status: "Pending Review",
  },
];

const EvidencePage = () => {
  return (
    <>
      {/* Documents Table Card */}
      <Card className="border border-[#E0E8ED] shadow-sm bg-white rounded-xl p-0">
        <CardContent className="p-3">
          <div className="rounded-lg overflow-hidden ">
            <Table>
              {/* Header */}
              <TableHeader className="bg-[#F5F8FB]">
                <TableRow className="hover:bg-[#F5F8FB] border-none rounded-2xl ">
                  {[
                    "Document Number",
                    "Document Name",
                    "Document Lead",
                    "Document Preparer",
                    "Date",
                    "Due Date",
                    "Status",
                  ].map((header, index, array) => (
                    <TableHead
                      key={header}
                      className={`
        text-xs font-normal text-[#1D3557] h-10
        ${index === 0 ? "rounded-l-[10px]" : ""}
        ${index === array.length - 1 ? "rounded-r-[10px]" : ""}
      `}
                    >
                      <div className="flex items-center gap-1 font-normal">
                        {header}
                        <span className="text-[#8597A8] text-[14px]">⇅</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {documents.map((doc) => (
                  <TableRow
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors h-15"
                  >
                    <TableCell className="text-sm text-[#1D3557]">
                      {doc.id}
                    </TableCell>

                    <TableCell className="text-sm font-normal  text-[#1D3557]">
                      {doc.name}
                    </TableCell>

                    <TableCell className="text-sm font-normal text-[#1D3557]">
                      {doc.lead}
                    </TableCell>

                    <TableCell className="text-sm font-normal text-[#1D3557]">
                      {doc.preparer}
                    </TableCell>

                    <TableCell className="text-sm font-normal text-[#1D3557]">
                      {doc.date}
                    </TableCell>

                    <TableCell className="text-sm font-normal text-[#1D3557]">
                      {doc.dueDate}
                    </TableCell>

                    <TableCell>
                      {doc.status === "Approved" ? (
                        <span className="px-3 py-2 text-xs font-normal rounded-full bg-[#34C7591A] text-[#34C759 ]">
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-2 text-xs font-normal rounded-full bg-[#FFCC001A] text-[#FFCC00]">
                          Pending Review
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">
        {/* COMMENTS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E0E8ED] p-4 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#1D3557] mb-2.5">
              Comments
            </h3>

            <div className="space-y-4">
              {/* Comment Item */}
              <div className="flex gap-4 p-4 border border-[#E0E8ED] rounded-lg">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 justify-center items-center">
                      <div className="w-6 h-6 rounded-full bg-[#E0E8ED] flex items-center justify-center text-xs font-semibold text-[#8597A8]">
                        E
                      </div>
                      <span className="text-sm font-bold text-[#1D3557]">
                        Sara Ibrahim
                      </span>
                    </div>
                    <span className="text-xs text-[#8597A8] font-normal">
                      2025-08-05
                    </span>
                  </div>

                  <p className="text-sm text-[#1D3557] font-normal mt-1">
                    Ensure The Plan Includes A Clear Governance Model.
                  </p>
                </div>
              </div>

              {/* Comment Item */}
              <div className="flex gap-4 p-4 border border-[#E0E8ED] rounded-lg">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 justify-center items-center">
                      <div className="w-6 h-6 rounded-full bg-[#E0E8ED] flex items-center justify-center text-xs font-semibold text-[#8597A8]">
                        M
                      </div>
                      <span className="text-sm font-bold text-[#1D3557]">
                        Sara Ibrahim
                      </span>
                    </div>
                    <span className="text-xs text-[#8597A8] font-normal">
                      2025-08-05
                    </span>
                  </div>

                  <p className="text-sm text-[#1D3557] font-normal mt-1">
                    Ensure The Plan Includes A Clear Governance Model.
                  </p>
                </div>
              </div>

              {/* Textarea */}
              <textarea className="w-full h-28  rounded-lg border border-[#E0E8ED] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              {/* Button */}
              <button className="mt-3 inline-flex items-center justify-center gap-2 w-44 h-8 rounded-lg bg-[#1D3557] text-white text-[16px] font-normal hover:opacity-90 transition">
                <Image
                  src="/sendIcon.png"
                  alt="Toggle Sidebar"
                  width={16}
                  height={16}
                  className="text-white" // Dark icon for light background
                />
                Post Comment
              </button>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div>
          <div className="bg-white rounded-xl border border-[#E0E8ED] p-4 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#1D3557] mb-4">
              Recent Activities
            </h3>

            <div className="space-y-4">
              <div className="border-b border-[#E0E8ED]" />
              {/* Activity Item */}
              <div className="flex items-center xl:items-start justify-between border-b pb-4  last:pb-0">
                <div className="flex gap-3 w-[75%] sm:w-[83%]">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#DB1F26]" />
                  <p className="text-[12px] sm:text-[16px] font-medium text-[#1D3557]">
                    Roadmap_Version1.Docx Uploaded By Rami AlSharif
                  </p>
                </div>
                <span className="text-xs text-[#8597A8] font-normal whitespace-nowrap lg:pt-1">
                  5 Mins Ago
                </span>
              </div>
              <div className="flex items-center xl:items-start justify-between border-b pb-4  border-[#E0E8ED] last:pb-0 ">
                <div className="flex gap-3 w-[75%] sm:w-[83%]">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#DB1F26]" />
                  <p className="text-[12px] sm:text-[16px] font-medium text-[#1D3557]">
                    Roadmap_Version1.Docx Uploaded By Rami AlSharif
                  </p>
                </div>
                <span className="text-xs text-[#8597A8] font-normal whitespace-nowrap lg:pt-1">
                  5 Mins Ago
                </span>
              </div>
              <div className="flex items-center xl:items-start justify-between border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex gap-3 w-[75%] sm:w-[83%]">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#DB1F26]" />
                  <p className="text-[12px] sm:text-[16px] font-medium text-[#1D3557]">
                    Roadmap_Version1.Docx Uploaded By Rami AlSharif
                  </p>
                </div>
                <span className="text-xs text-[#8597A8] font-normal whitespace-nowrap lg:pt-1">
                  5 Mins Ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EvidencePage;
