import React from "react";

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
}) => {
  return (
    <div className="relative flex flex-col w-full">
      {/* Si se pasa el label, lo mostramos */}
      {label && <label className="text-sm text-gray-600 mb-1">{label}</label>}

      <div className="relative flex items-center">
        {/* Ícono */}
        {Icon && (
          <span className="absolute left-3 text-gray-400">
            <Icon size={20} />
          </span>
        )}

        {/* Input */}
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 w-[20rem] border border-[#ff6c17] rounded-md focus:outline-none focus:ring-2 focus:ring-[#37dc52]"
        />
      </div>
    </div>
  );
};

export default Input;
