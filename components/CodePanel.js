import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

const CodePanel = ({ workflow }) => {
  React.useEffect(() => {
    Prism.highlightAll();
  }, [workflow]);

  return (
    <div className="bg-gray-900 dark:bg-black text-white p-4 overflow-auto" style={{ maxHeight: '40vh' }}>
      <h2 className="text-lg font-bold mb-4">Code Workflow</h2>

      {workflow.length === 0 && (
        <div className="text-gray-400 dark:text-gray-500 text-center">
          <p>Apply filters to see the generated code</p>
        </div>
      )}

      {workflow.map((step, index) => (
        <div key={step.id} className="mb-6">
          <div className="flex items-center mb-2">
            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
              {index + 1}
            </span>
            <h3 className="text-md font-semibold capitalize">{step.filter} Filter Code</h3>
          </div>

          <div className="bg-gray-800 dark:bg-gray-950 rounded p-3 border border-gray-700 dark:border-gray-800">
            <pre>
              <code className="language-python">{step.code}</code>
            </pre>
          </div>
        </div>
      ))}

      {workflow.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700 dark:border-gray-800">
          <h3 className="text-md font-semibold mb-3">Complete Workflow Code</h3>
          <div className="bg-gray-800 dark:bg-gray-950 rounded p-3 border border-gray-700 dark:border-gray-800">
            <pre>
              <code className="language-python">
                {`import cv2
import numpy as np

# Load image
image = cv2.imread('your_image.jpg')

${workflow.map((step, index) =>
                  `# Step ${index + 1}: Apply ${step.filter} filter\n${step.code}`
                ).join('\n\n')}

# Display or save result
cv2.imshow('Final Result', image)
cv2.waitKey(0)
cv2.destroyAllWindows()`}
              </code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePanel;