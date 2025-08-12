import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(file: File): Promise<string> {
  try {
    // Convertir le fichier en base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload vers Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'blog-tech',
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 630, crop: 'fill', quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Erreur lors de l\'upload vers Cloudinary:', error);
    throw new Error('Erreur lors de l\'upload de l\'image');
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    throw new Error('Erreur lors de la suppression de l\'image');
  }
} 