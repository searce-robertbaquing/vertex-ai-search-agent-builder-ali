import React from 'react';

const ParameterInput = ({ label, id, type = "number", value, min, max, placeholder, onChange, disabled }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        min={min}
        max={max}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-ayala-green-DEFAULT focus:border-ayala-green-DEFAULT sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default ParameterInput;
