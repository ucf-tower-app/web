import imageCompression from 'browser-image-compression';

const imageCompressionOptions = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
};

export const compressImage = async (image: File) => {
  try {
    const compressedFile = await imageCompression(image, imageCompressionOptions);
    return compressedFile;
  } catch (error) {
    console.log(error);
    return;
  }
};