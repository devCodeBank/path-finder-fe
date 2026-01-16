import React from "react";

const ActivityCard = ({
  title
}: {
  title: string;
}) => {
  return (
    <div className="bg-white border border-[#CCCCCC] rounded-lg overflow-hidden">
      <div className="px-4 h-[36px] border-b border-[#CCCCCC] flex items-center bg-[#F5F5F5]">
        <h3 className="text-[14px] font-[500] text-[#333333]">{title}</h3>
      </div>
      <div className="min-h-[142px]" />
    </div>
  );
};

export const Activity: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-full font-sans ">
      <ActivityCard title="Active Sessions" />
      <ActivityCard title="Activity History" />
      <ActivityCard title="Connected Apps" />
    </div>
  );
};

export default Activity;
