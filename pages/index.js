import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import PreviewPanel from '../components/PreviewPanel';
import CodePanel from '../components/CodePanel';

const Home = () => {
  const [filters, setFilters] = useState([]);
  const [image, setImage] = useState(null);
  const [workflow, setWorkflow] = useState([]);
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

  const handleFilterSelect = (filterName, params) => {
    if (!image && workflow.length === 0) {
      console.error('No image uploaded');
      return;
    }

    // Determine which image to use: original for first step, previous for subsequent steps
    const isWorkflowStep = workflow.length > 0;
    const previousImage = isWorkflowStep ? workflow[workflow.length - 1].image : null;

    if (isWorkflowStep) {
      // Apply filter to previous step's result
      const formData = new FormData();
      formData.append('filter_name', filterName);
      formData.append('params', JSON.stringify(params));
      formData.append('previous_image', previousImage);

      axios.post(`${process.env.BACKEND_URL}/process-workflow-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      })
        .then(response => {
          const processedImage = `data:image/png;base64,${response.data.image}`;
          const code = response.data.code;

          // Add to workflow
          setWorkflow(prev => [...prev, {
            id: Date.now(),
            filter: filterName,
            image: processedImage,
            code: code,
            description: getFilterDescription(filterName),
            parameters: params
          }]);
        })
        .catch(error => console.error('Error processing workflow image:', error));
    } else {
      // Apply filter to original uploaded image
      const formData = new FormData();
      formData.append('file', image);
      formData.append('filter_name', filterName);
      formData.append('params', JSON.stringify(params));

      axios.post(`${process.env.BACKEND_URL}/process-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      })
        .then(response => {
          const processedImage = `data:image/png;base64,${response.data.image}`;
          const code = response.data.code;

          // Add to workflow
          setWorkflow(prev => [...prev, {
            id: Date.now(),
            filter: filterName,
            image: processedImage,
            code: code,
            description: getFilterDescription(filterName),
            parameters: params
          }]);
        })
        .catch(error => console.error('Error processing image:', error));
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Store the raw file directly
      setWorkflow([]); // Clear workflow when new image is uploaded
    }
  };

  const clearWorkflow = () => {
    setWorkflow([]);
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

              {/* Navigation Links - Hidden on mobile, visible on larger screens */}
              <div className="hidden lg:flex space-x-6">
                <button
                  onClick={() => router.push('/docs')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  📚 Documentation
                </button>
                <button
                  onClick={() => router.push('/lab')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  🧪 Lab
                </button>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-3 lg:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer inline-block transition-colors text-sm lg:text-base"
                >
                  📁 Choose File
                </label>
              </div>

              {workflow.length > 0 && (
                <button
                  onClick={clearWorkflow}
                  className="px-3 lg:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors text-sm lg:text-base"
                >
                  🗑️ Clear
                </button>
              )}

              <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {workflow.length} step{workflow.length !== 1 ? 's' : ''}
              </span>

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

          {/* Mobile Navigation */}
          <div className="lg:hidden flex space-x-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push('/docs')}
              className="flex-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2 text-sm"
            >
              📚 Documentation
            </button>
            <button
              onClick={() => router.push('/lab')}
              className="flex-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2 text-sm"
            >
              🧪 Lab
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col lg:flex-row h-screen">
        <Sidebar onSelectFilter={handleFilterSelect} />
        <div className="flex flex-col flex-1">
          <PreviewPanel originalImage={image ? URL.createObjectURL(image) : null} workflow={workflow} />
          <CodePanel workflow={workflow} />
        </div>
      </div>
    </div>
  );
};

export default Home;