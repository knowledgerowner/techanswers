import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET - Récupérer une catégorie spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id }
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
        categoryIds: { has: category.id }
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

// PUT - Modifier une catégorie
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, seoTitle, seoDesc, seoKeywords, seoImg } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nom et slug sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier si le slug existe déjà (sauf pour cette catégorie)
    const existingSlug = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Une catégorie avec ce slug existe déjà" },
        { status: 400 }
      );
    }

    // Vérifier si le nom existe déjà (sauf pour cette catégorie)
    const existingName = await prisma.category.findFirst({
      where: {
        name,
        id: { not: id }
      }
    });

    if (existingName) {
      return NextResponse.json(
        { error: "Une catégorie avec ce nom existe déjà" },
        { status: 400 }
      );
    }

    // Modifier la catégorie
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        seoTitle,
        seoDesc,
        seoKeywords,
        seoImg
      }
    });

    return NextResponse.json({
      category,
      message: "Catégorie modifiée avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la modification de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { id } = await params;

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 400 }
      );
    }

    // Vérifier s'il y a des articles dans cette catégorie
    const articleCount = await prisma.article.count({
      where: {
        categoryIds: { has: id }
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
      where: { id }
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