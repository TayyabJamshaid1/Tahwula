export default function RecentActivities(){
  return (
     <div>
          <div className="bg-white rounded-xl border border-[#E0E8ED] p-4 shadow-sm h-full ">
            <h3 className="text-[16px] font-bold text-[#1D3557] mb-2">
              Recent Activities
            </h3>

            <div className="space-y-2">
              <div className="border-b border-[#E0E8ED]" />
              {/* Activity Item */}
              <div className="flex items-center lg:items-start justify-between border-b pb-2  last:pb-0">
                <div className="flex gap-3 w-[75%] sm:w-[80%]">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#DB1F26]" />
                  <p className="text-[12px] sm:text-[16px] font-medium text-[#1D3557]">
                    Roadmap_Version1.Docx Uploaded By Rami AlSharif
                  </p>
                </div>
                <span className="text-xs text-[#8597A8] font-normal whitespace-nowrap lg:pt-1">
                  5 Mins Ago
                </span>
              </div>
              <div className="flex items-center lg:items-start justify-between border-b pb-2  border-[#E0E8ED] last:pb-0 ">
                <div className="flex gap-3 w-[75%] sm:w-[80%]">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#DB1F26]" />
                  <p className="text-[12px] sm:text-[16px] font-medium text-[#1D3557]">
                    Roadmap_Version1.Docx Uploaded By Rami AlSharif
                  </p>
                </div>
                <span className="text-xs text-[#8597A8] font-normal whitespace-nowrap lg:pt-1">
                  5 Mins Ago
                </span>
              </div>
              <div className="flex items-center lg:items-start justify-between border-b pb-2 last:border-b-0 last:pb-1.5">
                <div className="flex gap-3 w-[75%] sm:w-[80%]">
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
  )
}