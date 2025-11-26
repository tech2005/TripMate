const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET // make sure you include this
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'TripMate',
    allowed_formats: ["png", "jpg", "jpeg"] // corrected
  },
});

module.exports = {
    cloudinary,
    storage,
};
