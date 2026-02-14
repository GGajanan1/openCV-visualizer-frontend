import React from 'react';

const ParameterInput = ({ parameter, value, onChange }) => {
  const renderInput = () => {
    switch (parameter.type) {
      case 'select':
        return (
          <select
            value={value || parameter.default}
            onChange={(e) => onChange(parameter.name, e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            {parameter.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'int':
        return (
          <input
            type="number"
            min={parameter.min}
            max={parameter.max}
            step={parameter.step}
            value={value || parameter.default}
            onChange={(e) => onChange(parameter.name, parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        );

      case 'float':
        return (
          <input
            type="number"
            min={parameter.min}
            max={parameter.max}
            step={parameter.step}
            value={value || parameter.default}
            onChange={(e) => onChange(parameter.name, parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || parameter.default}
            onChange={(e) => onChange(parameter.name, e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        );
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {parameter.name.charAt(0).toUpperCase() + parameter.name.slice(1).replace('_', ' ')}
      </label>
      {renderInput()}
    </div>
  );
};

export default ParameterInput;
