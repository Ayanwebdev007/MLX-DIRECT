const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Config Checked:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: '***' + process.env.CLOUDINARY_API_KEY.slice(-4),
    api_secret: '***'
});

cloudinary.api.ping()
    .then(function(res) {
        console.log('Ping Success:', res);
        process.exit(0);
    })
    .catch(function(err) {
        console.error('Ping Failed:', err);
        process.exit(1);
    });
