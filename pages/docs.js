import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Docs = () => {
  const [filters, setFilters] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    axios.get('http://127.0.0.1:8000/filters', {
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => setFilters(response.data.categories))
      .catch(error => console.error('Error fetching filters:', error));
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Full-screen Navbar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-3 lg:space-y-0">
            {/* Logo/Title */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              <h1 className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                OpenCV Visualizer
              </h1>

              {/* Navigation Links */}
              <div className="flex space-x-4 lg:space-x-6">
                <button
                  onClick={() => router.push('/docs')}
                  className="text-blue-600 dark:text-blue-400 font-medium transition-colors text-sm lg:text-base"
                >
                  📚 Documentation
                </button>
                <button
                  onClick={() => router.push('/lab')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm lg:text-base"
                >
                  🧪 Lab
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm lg:text-base"
                >
                  🏠 Home
                </button>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Documentation Content */}
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-gray-900 dark:text-gray-100">📚 Filter Documentation</h2>

          <div className="space-y-6 lg:space-y-8">
            {filters.map(category => (
              <div key={category.name} className="border-b border-gray-200 dark:border-gray-700 pb-4 lg:pb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 lg:mb-4">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {category.filters.map(filter => (
                    <div key={filter.name} className="bg-gray-50 dark:bg-gray-800 p-3 lg:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-base lg:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {filter.display_name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {getFilterDescription(filter.name)}
                      </p>
                      {filter.parameters.length > 0 && (
                        <div className="mb-3">
                          <strong className="text-sm text-gray-700 dark:text-gray-300">Parameters:</strong>
                          <ul className="list-disc list-inside mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {filter.parameters.map(param => (
                              <li key={param.name}>
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{param.name}</span>
                                <span className="text-gray-500 dark:text-gray-500"> ({param.type}): {param.default}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-3">
                        <strong className="text-sm text-gray-700 dark:text-gray-300">Example Code:</strong>
                        <pre className="bg-gray-900 dark:bg-black text-gray-100 dark:text-gray-300 p-2 lg:p-3 rounded mt-2 text-xs lg:text-sm overflow-x-auto">
                          <code>{`import cv2
import numpy as np

# Load your image
image = cv2.imread('your_image.jpg')

# Apply ${filter.display_name} filter
result = cv2.${filter.name}(image${filter.parameters.length > 0 ? ', ' + filter.parameters.map(p => `${p.name}=${p.default}`).join(', ') : ''})

# Display or save result
cv2.imshow('Result', result)
cv2.waitKey(0)
cv2.destroyAllWindows()`}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
