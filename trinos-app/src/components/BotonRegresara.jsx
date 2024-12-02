import React from "react";
import { useNavigate } from "react-router-dom";

const BotonRegresar = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Regresa a la página anterior
  };

  return (
    <button
      onClick={handleBack}
      className={`bg-gray-300 py-2 px-6 w-[12rem] text-black rounded-lg mt-4 hover:bg-gray-400 ${className}`}
    >
      Regresar
    </button>
  );
};

export default BotonRegresar;
