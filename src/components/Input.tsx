import React, { useState } from "react";

type InputProps = {
  label: string;
  type?: string;
  width?: string;
  required?: boolean;
};

const Input: React.FC<InputProps> = ({ label, type = "text", width = "52", required=false }) => {
  const [hasText, setHasText] = useState(false);

  return (
    <div className={`relative flex flex-col gap-2 text-white w-${width}`}>
      <input
        required={required}
        type={type}
        onChange={(e) => setHasText(e.target.value.length > 0)}
        onFocus={() => setHasText(true)}
        onBlur={(e) => setHasText(e.target.value.length > 0)}
        className="w-full h-11 px-2 rounded-md bg-transparent text-white text-base shadow-[3px_3px_10px_rgba(0,0,0,1),-1px_-1px_6px_rgba(255,255,255,0.4)] focus:outline-none focus:shadow-[3px_3px_10px_rgba(0,0,0,1),-1px_-1px_6px_rgba(255,255,255,0.4),inset_3px_3px_10px_rgba(0,0,0,1),inset_-1px_-1px_6px_rgba(255,255,255,0.4)] peer"
      />
      <label
        className={`absolute left-2 text-md text-white transition-all -z-10 ${
          hasText ? "-top-2 text-sm" : "top-2 text-base"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
