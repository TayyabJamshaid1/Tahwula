"use client"

import Image from "next/image";

 const StatCard = ({
  imageName,
  label,
  number,
}: {
  imageName: string;
  number: number;
  label: string;
}) => {
  return (
    <div className="bg-white border border-[#E0E8ED] rounded-lg p-2  xl:p-4 lg:pl-3.5   flex flex-col lg:flex-row justify-center lg:justify-start items-center gap-3 shadow-sm">
      <div className="w-8 h-8 rounded-md flex items-center justify-center pt-2">
        <Image
          src={`/${imageName}`}
          alt={label}
          width={24}
          height={24}
          className="object-contain"
        />
      </div>
      <div>
        <p className="text-2xl font-semibold text-center lg:text-left">
          {number}
        </p>
        <p className="text-sm text-[#8597A8]">{label}</p>
      </div>
    </div>
  );
};
export default StatCard;