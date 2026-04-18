const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a file to Cloudinary
 * @param {String} filePath - Path to the local file (if using multer disk storage)
 * @param {String} folder - Folder name in Cloudinary
 * @returns {Promise} - Cloudinary upload result
 */
exports.uploadToCloudinary = async (filePath, folder = 'kyc_documents') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto' // automatically detect if image or pdf
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary Upload Error: ${error.message}`);
  }
};

/**
 * Delete a file from Cloudinary (optional but good for cleanup)
 * @param {String} publicId - Cloudinary public ID
 */
exports.deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Cloudinary Delete Error: ${error.message}`);
  }
};
