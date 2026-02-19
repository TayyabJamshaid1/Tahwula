export default function OverallCompilanceSection() {
  const radius = 100;
  const circumference = Math.PI * radius; // semi-circle
  const progress = 65; // %
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white relative rounded-xl border border-[#E0E8ED]  shadow-sm h-full flex flex-col items-center justify-center">
      
      <h3 className="text-[16px] font-bold text-[#1D3557] absolute top-4 left-4">
        Overall Compliance Score
      </h3>

      {/* 260 x 260 Chart Container */}
      <div className="relative w-[260px] h-[260px] flex items-center justify-center ">

        <svg
          width="260"
          height="260"
          viewBox="0 0 260 260"
        >
          {/* Background Arc */}
          <path
            d="
              M 30 180
              A 100 100 0 0 1 230 180
            "
            fill="none"
            stroke="#E6EBF0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d="
              M 30 180
              A 100 100 0 0 1 230 180
            "
            fill="none"
            stroke="#DB1F26"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Centered Text */}
        <div className="absolute flex flex-col items-center justify-center mt-8">
          <span className="text-[44px] font-bold text-[#1D3557]">
            {progress}%
          </span>
          <span className="text-[14px] text-[#8597A8] mt-1">
            Basic Standards 2025
          </span>
        </div>
      </div>
    </div>
  );
}
