const cloudinary = require('cloudinary').v2;

if (process.env.CLOUDINARY_URL) {
  // It automatically configures itself from the environment variable
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.warn("Cloudinary is not configured. Missing CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME.");
}

module.exports = cloudinary;
