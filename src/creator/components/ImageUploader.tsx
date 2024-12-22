import React, { useState } from 'react';

const ImageUploader: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-uploader">
      <h2>Upload Crossword Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
      {imagePreview && (
        <div>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '100%', marginTop: '20px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
