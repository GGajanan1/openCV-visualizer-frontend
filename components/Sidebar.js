import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ParameterInput from './ParameterInput';

const Sidebar = ({ onSelectFilter }) => {
  const [categories, setCategories] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [parameters, setParameters] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    axios.get(`${process.env.BACKEND_URL}/filters`)
      .then(response => setCategories(response.data.categories))
      .catch(error => console.error('Error fetching filters:', error));
  }, []);

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    // Initialize parameters with defaults
    const defaultParams = {};
    filter.parameters.forEach(param => {
      defaultParams[param.name] = param.default;
    });
    setParameters(defaultParams);
  };

  const handleParameterChange = (paramName, value) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleApplyFilter = () => {
    if (selectedFilter) {
      onSelectFilter(selectedFilter.name, parameters);
    }
  };

  const getFilterDescription = (filter) => {
    const descriptions = {
      // Color Operations
      'grayscale': 'Converts image to grayscale (black and white)',
      'color_convert': 'Converts image to different color space',
      'brightness_contrast': 'Adjusts brightness and contrast of image',

      // Blurring & Smoothing
      'average_blur': 'Applies average blur to smooth the image',
      'gaussian_blur': 'Applies Gaussian blur for smooth noise reduction',
      'median_blur': 'Applies median blur to remove salt-and-pepper noise',
      'bilateral_filter': 'Applies bilateral filter for edge-preserving smoothing',

      // Edge Detection
      'canny': 'Detects edges using Canny edge detection algorithm',
      'sobel': 'Detects edges using Sobel operator',

      // Thresholding
      'binary_threshold': 'Applies binary threshold to create binary image',
      'adaptive_threshold': 'Applies adaptive threshold for varying lighting conditions',

      // Morphological Operations
      'erode': 'Erodes the boundaries of foreground objects',
      'dilate': 'Expands the boundaries of foreground objects',

      // Geometric Transformations
      'resize': 'Resizes the image to specified dimensions',
      'rotate': 'Rotates the image by specified angle',
      'flip': 'Flips the image horizontally or vertically',

      // Advanced Edge & Gradients
      'laplacian': 'Detects edges using Laplacian operator',
      'scharr': 'Detects edges using Scharr operator',
      'magnitude_gradient': 'Computes gradient magnitude from Sobel operators',

      // Full Morphology
      'opening': 'Performs morphological opening (erosion followed by dilation)',
      'closing': 'Performs morphological closing (dilation followed by erosion)',
      'morph_gradient': 'Computes morphological gradient (difference between dilation and erosion)',
      'top_hat': 'Computes top-hat transformation (difference between input and opening)',
      'black_hat': 'Computes black-hat transformation (difference between closing and input)',

      // Histogram & Intensity
      'equalize_histogram': 'Equalizes image histogram to improve contrast',
      'clahe': 'Applies Contrast Limited Adaptive Histogram Equalization',
      'normalize': 'Normalizes image pixel values to specified range',

      // Contours & Shape Detection
      'find_contours': 'Finds and draws contours in the image',
      'draw_contours': 'Draws detected contours on a blank background',
      'bounding_box': 'Draws bounding boxes around detected contours',

      // Feature Detection
      'orb_features': 'Detects ORB (Oriented FAST and Rotated BRIEF) features',
      'harris_corner': 'Detects corners using Harris corner detection',

      // Noise Reduction
      'denoise_gray': 'Applies non-local means denoising for grayscale images',
      'denoise_color': 'Applies non-local means denoising for color images',

      // Sharpening & Kernels
      'sharpen': 'Applies sharpening filter to enhance image details',
      'custom_kernel': 'Applies custom convolution kernel to the image',

      // Image Arithmetic
      'add_constant': 'Adds a constant value to all pixels',
      'multiply_constant': 'Multiplies all pixels by a constant value',

      // Bitwise Operations
      'bitwise_not': 'Applies bitwise NOT operation to image pixels',
      'bitwise_and': 'Applies bitwise AND operation to image pixels',
      'bitwise_or': 'Applies bitwise OR operation to image pixels',
      'bitwise_xor': 'Applies bitwise XOR operation to image pixels',

      // Image Pyramids
      'pyr_down': 'Reduces image resolution by half (pyramid down)',
      'pyr_up': 'Increases image resolution by factor of 2 (pyramid up)'
    };

    return descriptions[filter] || `${filter.replace('_', ' ')} filter applied`;
  };

  return (
    <div className="w-full lg:w-1/3 bg-gray-100 dark:bg-gray-800 p-4 overflow-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Filters</h2>

      {/* Filter Categories */}
      <div className="mb-6">
        {categories.map(category => (
          <div key={category.name} className="mb-4">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full text-left p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors flex justify-between items-center"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">{category.name}</span>
              <span className="text-gray-600 dark:text-gray-400">
                {expandedCategories[category.name] ? '▼' : '▶'}
              </span>
            </button>

            {expandedCategories[category.name] && (
              <div className="mt-2 space-y-1">
                {category.filters.map(filter => (
                  <button
                    key={filter.name}
                    onClick={() => handleFilterSelect(filter)}
                    className={`w-full text-left p-2 rounded transition-colors text-sm ${selectedFilter?.name === filter.name
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100'
                      : 'bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    {filter.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Parameter Controls */}
      {selectedFilter && (
        <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            {selectedFilter.display_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {getFilterDescription(selectedFilter.name)}
          </p>

          {selectedFilter.parameters.length > 0 && (
            <div className="space-y-3">
              {selectedFilter.parameters.map(param => (
                <div key={param.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {param.name}
                  </label>
                  <ParameterInput
                    parameter={param}
                    value={parameters[param.name]}
                    onChange={(value) => handleParameterChange(param.name, value)}
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleApplyFilter}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Apply Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;