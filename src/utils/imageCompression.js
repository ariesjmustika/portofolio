/**
 * Compresses an image file using HTML Canvas
 * @param {File} file - The original image file
 * @param {number} maxWidth - Maximum width of the compressed image
 * @param {number} quality - Image quality (0 to 1)
 * @returns {Promise<File>} - A promise that resolves to the compressed File object
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            // Preserve the original file name but make sure it has the right extension
            const ext = file.type === 'image/png' ? 'png' : 'jpeg';
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + '.' + ext, {
              type: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
