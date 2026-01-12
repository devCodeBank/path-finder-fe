import LogoIcon from "@assets/logos/company-logo.svg?react";
import React from "react";

export const TopNavBar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between bg-[#EAEAEA] px-4 sm:px-6 z-[1050]">
      <div className="flex items-center">
        <LogoIcon width={23} height={23} />
        <h1 className=" text-[18px] text-[#666666] lowercase font-[500] ml-[10px]">
          pathfinder ats crm
        </h1>
      </div>
    </header>
  );
};

export default TopNavBar;
