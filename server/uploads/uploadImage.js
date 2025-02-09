const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'dprtp7liy',
  api_key: '857954713841377',
  api_secret: 'OpFNfGWS-H2GbHx8dxM2wJ2keug'
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
