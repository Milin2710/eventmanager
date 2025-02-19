const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

async function uploadImages(imageFiles) {
  const uploadPromises = imageFiles.map((image) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "userprofilepic",
        },
        (error, result) => {
          if (error) {
            reject(`Failed to upload image: ${error.message}`);
          } else {
            resolve(result.url);
          }
        }
      );

      uploadStream.end(image.buffer);
    });
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error(`Error uploading images: ${error}`);
    throw error;
  }
}

module.exports = uploadImages;
