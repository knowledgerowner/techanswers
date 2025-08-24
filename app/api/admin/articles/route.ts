import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { notifyArticlePublished } from "@/lib/notifications";

// GET - Récupérer tous les articles avec pagination et filtres
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status"); // "published", "draft", "all"
    const category = searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } }
      ];
    }

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    if (category && category !== "all") {
      where.categoryIds = { has: category };
    }

    // Récupérer les articles avec les relations
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.article.count({ where })
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel article
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const body = await request.json();
    const {
      title,
      content,
      slug,
      imageUrl,
      excerpt,
      isPublished = false,
      isMarketing = false,
      isPremium = false,
      isBilled = false,
      premiumPrice = 0,
      billedPrice = 0,
      isAuto = false,
      seoTitle,
      seoDesc,
      seoKeywords,
      seoImg,
      categoryIds = []
    } = body;

    // Validation
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Titre, contenu et slug sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si le slug existe déjà
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: "Un article avec ce slug existe déjà" },
        { status: 400 }
      );
    }

    // Créer l'article
    const article = await prisma.article.create({
      data: {
        title,
        content,
        slug,
        imageUrl,
        excerpt,
        isPublished,
        isMarketing,
        isPremium,
        isBilled,
        premiumPrice,
        billedPrice,
        isAuto,
        seoTitle,
        seoDesc,
        seoKeywords,
        seoImg,
        categoryIds,
        userId: admin.userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    // Envoyer des notifications aux utilisateurs abonnés si l'article est publié
    if (isPublished && categoryIds.length > 0) {
      try {
        await notifyArticlePublished({
          articleId: article.id,
          articleTitle: article.title,
          articleSlug: article.slug,
          categoryIds: categoryIds,
          authorUsername: article.user.username
        });
      } catch (notificationError) {
        console.error('Erreur lors de l\'envoi des notifications:', notificationError);
        // Ne pas faire échouer la création de l'article si les notifications échouent
      }
    }

    return NextResponse.json({
      article,
      message: "Article créé avec succès"
    }, { status: 201 });

  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 