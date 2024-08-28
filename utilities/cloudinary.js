const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "df7elmrdm",
  api_key: "712436319464716",
  api_secret: "yT6i_HMEGWr9l-8_RqF2QvEscOc",
});

module.exports = cloudinary;
