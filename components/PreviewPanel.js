import React from 'react';

const PreviewPanel = ({ originalImage, workflow }) => {
  const formatParameters = (params) => {
    if (!params || Object.keys(params).length === 0) return '';

    const paramStrings = Object.entries(params).map(([key, value]) => {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
      return `${formattedKey}: ${value}`;
    });

    return ` (${paramStrings.join(', ')})`;
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Image Workflow</h2>

      {originalImage && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Original Image</h3>
          <div className="flex justify-center">
            <img
              src={originalImage}
              alt="Original"
              className="max-w-xs max-h-48 border-2 border-gray-400 dark:border-gray-600 rounded shadow-md"
            />
          </div>
        </div>
      )}

      {workflow.length === 0 && originalImage && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          <p>Select filters from sidebar to start building your workflow</p>
        </div>
      )}

      {workflow.length === 0 && !originalImage && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          <p>Upload an image to get started</p>
        </div>
      )}

      {workflow.map((step, index) => (
        <div key={step.id} className="mb-6">
          {/* Show connection arrow for workflow steps */}
          {index > 0 && (
            <div className="flex justify-center mb-2">
              <div className="flex items-center text-blue-500 dark:text-blue-400">
                <div className="w-8 h-0.5 bg-blue-300 dark:bg-blue-600"></div>
                <span className="mx-2 text-sm">↓</span>
                <div className="w-8 h-0.5 bg-blue-300 dark:bg-blue-600"></div>
              </div>
            </div>
          )}

          <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
            <div className="flex items-center mb-2">
              <span className="bg-blue-500 dark:bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
                {index + 1}
              </span>
              <h3 className="text-md font-semibold capitalize text-gray-900 dark:text-gray-100">
                {step.filter.replace('_', ' ')} Filter
                {formatParameters(step.parameters)}
              </h3>
            </div>

            <div className="flex justify-center mb-2">
              <img
                src={step.image}
                alt={`${step.filter} processed`}
                className="max-w-xs max-h-48 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
              />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center italic">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewPanel;