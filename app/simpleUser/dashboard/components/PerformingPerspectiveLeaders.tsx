export default function PerformingPerspectiveLeaders() {
  return (
    <div className="bg-white rounded-xl border border-[#E0E8ED] p-4 py-5  shadow-sm h-full">
      <h3 className="text-[16px] font-bold text-[#1D3557] mb-4">
        Top Performing Perspective Leaders
      </h3>

      <div className="space-y-2">
        {/* <div className="border-b border-[#E0E8ED]" /> */}

        {/* Leader 1 */}
        <div className="flex items-center justify-between border-b pb-2 last:pb-0">
          <div className="flex items-center gap-3 w-[75%]">
            <img
              src="https://i.pravatar.cc/40?img=4"
              className="w-12 h-12 rounded-full object-cover"
              alt="leader"
            />
            <div>
              <p className="text-[16px] font-medium text-[#1D3557]">
                Ahmed Al-Ali
              </p>
              <p className="text-[16px] font-medium text-[#8597A8]">
                Strategy Perspective
              </p>
            </div>
          </div>
          <span className="text-[16px] font-semibold text-[#1D3557]">96%</span>
        </div>

        {/* Leader 2 */}
        <div className="flex items-center justify-between border-b pb-2 last:pb-0">
          <div className="flex items-center gap-3 w-[75%]">
            <img
              src="https://i.pravatar.cc/40?img=3"
              className="w-12 h-12 rounded-full object-cover"
              alt="leader"
            />
            <div>
              <p className="text-[16px] font-medium text-[#1D3557]">
                Sarah Al-Khaled
              </p>
              <p className="text-[16px] font-medium text-[#8597A8]">
                Beneficiary Perspective
              </p>
            </div>
          </div>
          <span className="text-[16px] font-semibold text-[#1D3557]">94%</span>
        </div>

        {/* Leader 3 */}
        <div className="flex items-center justify-between last:border-b-0">
          <div className="flex items-center gap-3 w-[75%]">
            <img
              src="https://i.pravatar.cc/40?img=4"
              className="w-12 h-12 rounded-full object-cover"
              alt="leader"
            />
            <div>
              <p className="text-[16px] font-medium text-[#1D3557]">
                Mohammad Al-Mansour
              </p>
              <p className="text-[16px] font-medium text-[#8597A8]">
                IT Perspective
              </p>
            </div>
          </div>
          <span className="text-[16px] font-semibold text-[#1D3557]">92%</span>
        </div>
      </div>
    </div>
  );
}
