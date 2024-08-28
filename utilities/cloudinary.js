const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "df7elmrdm",
  api_key: "591189858844837",
  api_secret: "sjaA9LLwcV0ylGrHlcAQLkWu1_k",
});

module.exports = cloudinary;
