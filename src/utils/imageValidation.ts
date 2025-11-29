import { IMAGE_CONFIG } from '../config/constants';

/**
 * Validates an uploaded image file for use as a crossword puzzle source
 * @param file - The file to validate
 * @returns Promise resolving to validation result
 */
export const validateImage = (file: File): Promise<{ isValid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    // Check file type
    const allowedTypes = IMAGE_CONFIG.ALLOWED_TYPES.join('|').replace(/image\//g, '');
    const typeRegex = new RegExp(`^image/(${allowedTypes})$`);
    
    if (!typeRegex.test(file.type)) {
      resolve({ isValid: false, error: 'Please upload a JPG or PNG image.' });
      return;
    }

    // Check file content
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Clean up
      URL.revokeObjectURL(objectUrl);

      // Validate minimum dimensions
      if (img.width < IMAGE_CONFIG.MIN_WIDTH || img.height < IMAGE_CONFIG.MIN_HEIGHT) {
        resolve({ 
          isValid: false, 
          error: `Image is too small. Minimum size is ${IMAGE_CONFIG.MIN_WIDTH}x${IMAGE_CONFIG.MIN_HEIGHT} pixels.` 
        });
        return;
      }

      resolve({ isValid: true });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ 
        isValid: false, 
        error: 'Failed to load image. Please try another file.' 
      });
    };

    img.src = objectUrl;
  });
};
