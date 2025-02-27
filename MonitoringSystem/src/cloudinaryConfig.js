// cloudinaryConfig.js
const CLOUDINARY_CLOUD_NAME = 'dfos29ji2';
const CLOUDINARY_UPLOAD_PRESET = 'MonitoringSystem';

/**
 * Upload a file to Cloudinary directly from the browser
 * @param {File} file - The file to upload
 * @returns {Promise<string>} The URL of the uploaded file
 */
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Generate a Cloudinary URL with transformations
 * @param {string} publicId - The public ID of the resource
 * @param {Object} options - Transformation options
 * @returns {string} The transformed URL
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  const { width, height, crop = 'fill', format = 'auto', quality = 'auto' } = options;
  
  let transformations = `f_${format},q_${quality}`;
  
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (crop) transformations += `,c_${crop}`;
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};