export default function OverallCompilanceSection() {
  const radius = 100;
  const circumference = Math.PI * radius; // semi-circle
  const progress = 65; // %
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  

  return (
<div className="bg-white rounded-xl border border-[#E0E8ED] shadow-sm flex flex-col h-full">

  {/* Header */}
  <div className="px-4 pt-4 pb-2">
    <h3 className="text-[16px] font-bold text-[#1D3557]">
  Overall Compliance Score    </h3>
  </div>

  {/* Content */}
  <div className="flex flex-col flex-1">

    {/* Gauge */}
    <div className="flex-1 flex items-center justify-center px-4">

      <div className="relative w-full max-w-[420px] aspect-[13/6]">

        <svg
          viewBox="-10 32 280 110"
          className="w-full h-auto overflow-visible"
        >
          <path
            d="M 30 140 A 100 100 0 0 1 230 140"
            fill="none"
            stroke="#E6EBF0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          <path
            d="M 30 140 A 100 100 0 0 1 230 140"
            fill="none"
            stroke="#DB1F26"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center top-[30%] gap-4">
          <span className="text-[40px] font-bold text-[#1D3557]">
            {progress}%
          </span>
          <span className="text-[13px] text-[#8597A8]">
Basic Standards 2025          </span>
        </div>

      </div>
    </div>

  

  </div>
</div>

  );
}
