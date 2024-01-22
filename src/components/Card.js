import React from "react";

function Card({Children}) {
  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Project</strong>
      <div className="w-full mt-3 flex-1 text-xs">
        {Children}
      </div>
    </div>
  );
}

export default Card;
