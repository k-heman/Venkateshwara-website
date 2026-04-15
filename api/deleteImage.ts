import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: any, res: any) {
  // Allow only POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ message: 'public_id is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return res.status(200).json({ success: true, result });
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
