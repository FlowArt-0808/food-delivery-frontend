import * as React from "react";
const HumanIcon = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 11 13"
    className={className}
    {...props}
  >
    <path
      stroke="#FAFAFA"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.833 12.5v-1.333A2.667 2.667 0 0 0 7.167 8.5h-4A2.667 2.667 0 0 0 .5 11.167V12.5m7.333-9.333a2.667 2.667 0 1 1-5.333 0 2.667 2.667 0 0 1 5.333 0Z"
    />
  </svg>
);
export default HumanIcon;
