export const validateImage = (file: File): Promise<{ isValid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    // Check file type
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      resolve({ isValid: false, error: 'Please upload a JPG or PNG image.' });
      return;
    }

    // Check file content
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Clean up
      URL.revokeObjectURL(objectUrl);

      // Basic validation - we can enhance this later with actual puzzle detection
      if (img.width < 200 || img.height < 200) {
        resolve({ 
          isValid: false, 
          error: 'Image is too small. Please upload a larger image.' 
        });
        return;
      }

      // TODO: Add more sophisticated puzzle detection here
      // For now, we'll just validate the image dimensions
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
