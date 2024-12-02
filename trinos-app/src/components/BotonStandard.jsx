import React from "react";
import { Link } from "react-router-dom";

const BotonStandard = ({ to, children, className = "", ...props }) => {
  return (
    <Link to={to}>
      <button
        className={`bg-yellow-500 w-[100%] text-white py-2 px-6 mt-2 rounded-lg hover:bg-yellow-100 hover:text-black transition-all ${className} border-[#ff6c17] border-2`}
        {...props}
      >
        {children}
      </button>
    </Link>
  );
};

export default BotonStandard;
