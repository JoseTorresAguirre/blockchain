import React from "react";

const BotonSubmit = ({
  type = "submit",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      type={type} // Asegura que el tipo del botón sea 'submit' por defecto
      className={`bg-blue-500 text-white w-[20rem] py-2 px-6 rounded-lg hover:bg-blue-100 hover:text-black transition-all ${className} border-[#ff6c17] border-2`}
      {...props} // Permite pasar otras propiedades como onClick, disabled, etc.
    >
      {children}
    </button>
  );
};

export default BotonSubmit;
