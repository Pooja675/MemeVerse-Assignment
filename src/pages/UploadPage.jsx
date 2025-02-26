import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const UploadPage = () => {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'image/gif')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image or GIF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }
    if (!caption.trim()) {
      alert('Please add a caption');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setUploadedUrl(data.secure_url);
        // Reset form after successful upload
        setSelectedFile(null);
        setPreview(null);
        setCaption('');
        alert('Meme uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload meme. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Upload Your Meme
        </h1>

        {/* Upload Section */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
            {preview ? (
              <div className="mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded-lg"
                />
              </div>
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-6xl mb-4">📸</div>
                <p className="text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.gif"
              className="hidden"
            />
          </div>
        </div>

        {/* Caption Section */}
        {preview && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                rows="3"
                placeholder="Enter your meme caption..."
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Meme'}
            </button>
          </div>
        )}

        {/* Display uploaded image URL */}
        {uploadedUrl && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-md">
            <p className="text-green-800 dark:text-green-200">
              Image uploaded successfully! URL:
            </p>
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 break-all hover:underline"
            >
              {uploadedUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
