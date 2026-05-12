"use client"
export default function OverviewPage() {
  return (
    <div className="space-y-6 ">
      {/* MAIN BOX SECTION */}
      <div className="bg-white rounded-2xl border border-[#E0E8ED] overflow-x-auto">
        <div className="relative min-w-[900px]">
          {/* Continuous Vertical Divider */}
          <div className="absolute left-[255px] top-0 bottom-0 w-px bg-gray-200" />

          <div className="px-6 py-4 space-y-4">
            {/* ROW */}
            <div className="grid grid-cols-[220px_1fr] gap-6 items-stretch">
              <div className="bg-[#1B35570D] text-[16px] font-normal text-[#1D3557] px-4 py-3 rounded-lg flex items-center">
                Objective
              </div>

              <div className="bg-[#F5F8FA] text-[16px] text-[#1D3557] font-normal px-5 py-3 rounded-lg leading-relaxed">
                Develop A Digital Transformation Strategy Aligned With The
                Organization's Strategy And The Objectives Of Saudi Vision 2030.
              </div>
            </div>

            {/* IMPLEMENTATION REQUIREMENTS */}
            <div className="grid grid-cols-[220px_1fr] gap-6 items-stretch">
              <div className="bg-[#1B35570D] text-[16px] font-normal text-[#1D3557] px-4 py-4 rounded-lg">
                Implementation Requirements
              </div>

              <div className="bg-[#F5F8FA] text-[16px] text-[#1D3557] font-normal px-5 py-4 rounded-lg leading-relaxed space-y-2">
                <p>
                  Prepare A Digital Transformation Strategy For The Transition
                  To Electronic Government Transactions, Including The
                  Following:
                </p>
                <p>
                  A. The Organization's Vision, Mission, Strategic Pillars, And
                  Strategic Objectives, And Their Alignment With The
                  Organization’s Overall Strategy.
                </p>
                <p>
                  B. Strategic Initiatives, Programs, And Performance
                  Indicators.
                </p>
                <p>
                  C. A Clear Methodology For Integration And Coordination With
                  Relevant External Entities To Achieve The Strategy’s
                  Objectives.
                </p>
                <p>
                  D. Required Competencies, Capabilities, And Skills Necessary
                  To Achieve The Strategy’s Objectives.
                </p>
              </div>
            </div>

            {/* ROW */}
            <div className="grid grid-cols-[220px_1fr] gap-6 items-stretch">
              <div className="bg-[#1B35570D] text-[16px] font-normal text-[#1D3557] px-4 py-3 rounded-lg flex items-center">
                Evidence Documents
              </div>

              <div className="bg-[#F5F8FA] text-[16px] text-[#1D3557] font-normal px-5 py-3 rounded-lg leading-relaxed">
                Submit The Approved Digital Transformation Strategy That
                Includes All The Requirements Of This Standard, Provided That It
                Has Been Approved Within A Period Not Exceeding 36 Months.
              </div>
            </div>

            {/* ROW */}
            <div className="grid grid-cols-[220px_1fr] gap-6 items-stretch">
              <div className="bg-[#1B35570D] text-[16px] font-normal text-[#1D3557] px-4 py-3 rounded-lg flex items-center">
                Related Regulations
              </div>

              <div className="bg-[#F5F8FA] text-[16px] text-[#1D3557] font-normal px-5 py-3 rounded-lg leading-relaxed">
                Council Of Ministers Resolution No. (40) Dated 27/2/1427H,
                Clause (16).
              </div>
            </div>

            {/* ROW */}
            <div className="grid grid-cols-[220px_1fr] gap-6 items-stretch">
              <div className="bg-[#1B35570D] text-[16px] font-normal text-[#1D3557] px-4 py-3 rounded-lg flex items-center">
                Scope
              </div>

              <div className="bg-[#F5F8FA] text-[16px] text-[#1D3557] font-normal px-5 py-3 rounded-lg leading-relaxed">
                All Government Entities.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LEADERS SECTION */}
      <div className="bg-white rounded-xl border border-[#E0E8ED] p-3">
        <h3 className="text-[16px] font-bold text-[#1D3557] mb-2">Leaders</h3>

        <div className="flex gap-4 flex-wrap ">
          {/* Leader Card */}
          <div className="flex items-center gap-3 bg-[#F5F8FA] p-3 rounded-lg">
            <img
              src="https://i.pravatar.cc/40?img=3"
              alt="leader"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-[16px] font-medium text-[#1D3557]">Ahmed Al-Ali</p>
              <p className="text-[16px] text-[#8597A8] font-medium">Strategy Perspective</p>
            </div>
          </div>

          {/* Leader Card */}
          <div className="flex items-center gap-3 bg-[#F5F8FA] p-3 rounded-lg">
            <img
              src="https://i.pravatar.cc/40?img=4"
              alt="leader"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
             <p className="text-[16px] font-medium text-[#1D3557]">Ahmed Al-Ali</p>
                <p className="text-[16px] text-[#8597A8] font-medium">Strategy Perspective</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}