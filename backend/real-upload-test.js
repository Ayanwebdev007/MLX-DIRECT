const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create a dummy file to upload
const testFile = 'test-image.txt';
fs.writeFileSync(testFile, 'This is a test upload for KYC');

async function runTest() {
    console.log('Starting real upload test...');
    try {
        const result = await cloudinary.uploader.upload(testFile, {
            folder: 'test_uploads',
            resource_type: 'auto'
        });
        console.log('✅ Upload Success!');
        console.log('URL:', result.secure_url);
    } catch (error) {
        console.error('❌ Upload Failed!');
        console.error('Error Details:', error);
    } finally {
        if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    }
}

runTest();
