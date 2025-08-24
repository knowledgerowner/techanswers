import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET - Récupérer toutes les catégories
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } }
      ];
    }

    // Récupérer les catégories avec le nombre d'articles
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: limit
      }),
      prisma.category.count({ where })
    ]);

    // Compter les articles pour chaque catégorie
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const articleCount = await prisma.article.count({
          where: {
            categoryIds: { has: category.id }
          }
        });
        return {
          ...category,
          articleCount
        };
      })
    );

    return NextResponse.json({
      categories: categoriesWithCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const body = await request.json();
    const { name, slug, description, seoTitle, seoDesc, seoKeywords, seoImg } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nom et slug sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si le slug existe déjà
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Une catégorie avec ce slug existe déjà" },
        { status: 400 }
      );
    }

    // Vérifier si le nom existe déjà
    const existingName = await prisma.category.findUnique({
      where: { name }
    });

    if (existingName) {
      return NextResponse.json(
        { error: "Une catégorie avec ce nom existe déjà" },
        { status: 400 }
      );
    }

    // Créer la catégorie
    const category = await prisma.category.create({
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
      message: "Catégorie créée avec succès"
    }, { status: 201 });

  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 