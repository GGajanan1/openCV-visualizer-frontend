import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Lab = () => {
  const [filters, setFilters] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    axios.get(`${process.env.BACKEND_URL}/filters`, {
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
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm lg:text-base"
                >
                  📚 Documentation
                </button>
                <button
                  onClick={() => router.push('/lab')}
                  className="text-blue-600 dark:text-blue-400 font-medium transition-colors text-sm lg:text-base"
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

      {/* Lab Content */}
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 lg:mb-4 text-gray-900 dark:text-gray-100">🧪 OpenCV Lab</h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Welcome to the OpenCV Lab! This is your experimental playground to explore and learn about all the amazing image processing filters available.
              Test different filters, understand their parameters, and see real-world examples.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* Quick Start Guide */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 lg:p-6 rounded-xl border border-blue-200 dark:border-gray-600">
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 lg:mb-4">🚀 Quick Start Guide</h3>
              <ol className="space-y-2 lg:space-y-3 text-base lg:text-lg text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">1.</span>
                  <span>📁 Upload an image using the "Choose File" button on the Home page</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">2.</span>
                  <span>🎨 Select a filter from the sidebar categories</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">3.</span>
                  <span>⚙️ Adjust filter parameters as needed</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">4.</span>
                  <span>✨ Click "Apply Filter" to see the result</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">5.</span>
                  <span>🔄 Chain multiple filters to create complex workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">6.</span>
                  <span>💾 Copy the generated code for your projects</span>
                </li>
              </ol>
            </div>

            {/* Filter Categories Overview */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 p-4 lg:p-6 rounded-xl border border-green-200 dark:border-gray-600">
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 lg:mb-4">📊 Available Filter Categories</h3>
              <div className="space-y-2 lg:space-y-3">
                {filters.map(category => (
                  <div key={category.name} className="flex justify-between items-center p-2 lg:p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 lg:mr-3"></div>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm lg:text-base">{category.name}</span>
                    </div>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-bold">
                      {category.filters.length} filters
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Filters */}
          <div className="mb-6 lg:mb-8">
            <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6 text-center">⭐ Popular Filters to Try</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {[
                { name: 'grayscale', desc: 'Convert to B&W', icon: '⚫' },
                { name: 'gaussian_blur', desc: 'Smooth image', icon: '🌫' },
                { name: 'canny', desc: 'Edge detection', icon: '🔲' },
                { name: 'sharpen', desc: 'Enhance details', icon: '✨' },
                { name: 'equalize_histogram', desc: 'Improve contrast', icon: '🎭' },
                { name: 'bilateral_filter', desc: 'Preserve edges', icon: '🛡️' },
                { name: 'resize', desc: 'Change dimensions', icon: '📐' },
                { name: 'clahe', desc: 'Adaptive contrast', icon: '🔆' }
              ].map(filter => (
                <div key={filter.name} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-3 lg:p-4 rounded-xl border border-purple-200 dark:border-gray-600 hover:shadow-lg transition-all cursor-pointer">
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl mb-2">{filter.icon}</div>
                    <div className="font-bold text-purple-800 dark:text-purple-300 mb-1 text-sm lg:text-base">
                      {filter.name.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-xs lg:text-sm text-purple-600 dark:text-purple-400">
                      {filter.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips and Tricks */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 p-4 lg:p-6 rounded-xl border border-yellow-200 dark:border-gray-600">
            <h3 className="text-xl lg:text-2xl font-semibold text-yellow-800 dark:text-yellow-300 mb-3 lg:mb-4">💡 Pro Tips & Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <ul className="space-y-2 lg:space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">🎯</span>
                  <span className="text-sm lg:text-base">Start with basic filters like grayscale or blur before moving to advanced ones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">🔗</span>
                  <span className="text-sm lg:text-base">Use the workflow feature to chain multiple filters for complex effects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">📖</span>
                  <span className="text-sm lg:text-base">Check the generated code to learn OpenCV implementation details</span>
                </li>
              </ul>
              <ul className="space-y-2 lg:space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">🧪</span>
                  <span className="text-sm lg:text-base">Experiment with different parameter values to see how they affect the output</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">🌙</span>
                  <span className="text-sm lg:text-base">Use dark mode for better visibility during long editing sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">💾</span>
                  <span className="text-sm lg:text-base">Save your workflows by copying the generated code to your projects</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-6 lg:mt-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl inline-block">
              <button
                onClick={() => router.push('/')}
                className="text-lg lg:text-xl font-semibold hover:scale-105 transition-transform"
              >
                🚀 Start Experimenting in the Main App
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lab;
