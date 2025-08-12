import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET - Récupérer une catégorie spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const category = await prisma.category.findUnique({
      where: { id: params.id }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    // Compter les articles pour cette catégorie
    const articleCount = await prisma.article.count({
      where: {
        categoryIds: { has: params.id }
      }
    });

    return NextResponse.json({ 
      category: {
        ...category,
        articleCount
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour une catégorie
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const body = await request.json();
    const { name, slug, description } = body;

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier si le slug existe déjà (sauf pour cette catégorie)
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Une catégorie avec ce slug existe déjà" },
          { status: 400 }
        );
      }
    }

    // Vérifier si le nom existe déjà (sauf pour cette catégorie)
    if (name && name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name }
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "Une catégorie avec ce nom existe déjà" },
          { status: 400 }
        );
      }
    }

    // Mettre à jour la catégorie
    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description
      }
    });

    return NextResponse.json({
      category: updatedCategory,
      message: "Catégorie mise à jour avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier si la catégorie contient des articles
    const articleCount = await prisma.article.count({
      where: {
        categoryIds: { has: params.id }
      }
    });

    if (articleCount > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer une catégorie qui contient des articles" },
        { status: 400 }
      );
    }

    // Supprimer la catégorie
    await prisma.category.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: "Catégorie supprimée avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 