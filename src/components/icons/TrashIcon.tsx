import React from "react";

type TrashIconProps = {
  size?: number;
  className?: string;
};

const TrashIcon: React.FC<TrashIconProps> = ({ size = 17, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g opacity="0.7">
      <path
        d="M13.459 4.95833L12.8446 13.5593C12.7917 14.3006 12.1748 14.875 11.4316 14.875H5.56974C4.8265 14.875 4.20962 14.3006 4.15667 13.5593L3.54232 4.95833M7.08398 7.79167V12.0417M9.91732 7.79167V12.0417M10.6257 4.95833V2.83333C10.6257 2.44213 10.3085 2.125 9.91732 2.125H7.08398C6.69278 2.125 6.37565 2.44213 6.37565 2.83333V4.95833M2.83398 4.95833H14.1673"
        stroke="#666666"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default TrashIcon;
