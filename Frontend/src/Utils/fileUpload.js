// Utility function to handle file uploads and convert to base64
export const handleFileUpload = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

// Function to handle multiple file uploads
export const handleMultipleFileUpload = async (files) => {
  const uploadPromises = Array.from(files).map(file => handleFileUpload(file));
  return Promise.all(uploadPromises);
};

// Function to validate file type
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  return allowedTypes.includes(file.type);
};

// Function to validate file size (default 5MB)
export const validateFileSize = (file, maxSize = 5 * 1024 * 1024) => {
  return file.size <= maxSize;
}; 