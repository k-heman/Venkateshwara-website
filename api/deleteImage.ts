// Cloudinary delete API removed.
// Image deletion via Cloudinary is no longer used.
// Products are deleted directly from Firestore; images remain in Firebase Storage.
export default async function handler(_req: any, res: any) {
  return res.status(410).json({ message: 'Endpoint deprecated. Cloudinary integration removed.' });
}
