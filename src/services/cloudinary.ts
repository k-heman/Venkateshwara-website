export const uploadToCloudinary = async (file: File): Promise<{ secure_url: string, public_id: string }> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables missing');
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error uploading image');
    }
    return { secure_url: data.secure_url, public_id: data.public_id };
  } catch (error) {
    console.error("Upload to Cloudinary error", error);
    throw error;
  }
};

export const deleteImageFromCloudinary = async (public_id: string): Promise<boolean> => {
  if (!public_id || public_id.trim() === '') {
    console.log("No valid public_id provided to deleteImageFromCloudinary, skipping.");
    return true; // Nothing to delete
  }
  
  try {
    console.log(`Attempting to delete Cloudinary image: ${public_id}`);
    const response = await fetch('/api/deleteImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Cloudinary Delete Error] Status: ${response.status} | Bad Response: ${errorText}`);
      return false;
    }

    const data = await response.json();
    console.log("Cloudinary Delete Success:", data);
    return data.success;
  } catch(error) {
    console.error(`[Cloudinary Delete Fetch/Network Error]:`, error);
    return false;
  }
}
