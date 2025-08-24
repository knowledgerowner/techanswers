import { requireAdminAsync } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminAsync(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucune image fournie' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'L\'image ne doit pas dépasser 5MB' },
        { status: 400 }
      );
    }

    // Upload vers Cloudinary
    const imageUrl = await uploadImage(file);
    
    console.log('Upload Cloudinary réussi:', imageUrl);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    );
  }
} 