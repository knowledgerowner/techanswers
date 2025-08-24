import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { notifyArticlePublished } from "@/lib/notifications";

// GET - Récupérer un article spécifique
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
    const article = await prisma.article.findUnique({
      where: { id: id },
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

    if (!article) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });

  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un article
export async function PATCH(
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
    const {
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
      categoryIds
    } = body;

    // Vérifier si l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si le slug existe déjà (sauf pour cet article)
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Un article avec ce slug existe déjà" },
          { status: 400 }
        );
      }
    }

    // Mettre à jour l'article
    const updatedArticle = await prisma.article.update({
      where: { id: id },
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
        categoryIds
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

    // Envoyer des notifications si l'article est publié et a des catégories
    if (isPublished && categoryIds && categoryIds.length > 0) {
      try {
        console.log('📧 [ADMIN] Envoi de notifications pour article modifié:', updatedArticle.title);
        await notifyArticlePublished({
          articleId: updatedArticle.id,
          articleTitle: updatedArticle.title,
          articleSlug: updatedArticle.slug,
          authorUsername: updatedArticle.user.username,
          categoryIds: categoryIds
        });
        console.log('✅ [ADMIN] Notifications envoyées pour article modifié');
      } catch (notificationError) {
        console.error('❌ [ADMIN] Erreur lors de l\'envoi des notifications:', notificationError);
        // Ne pas faire échouer la mise à jour de l'article si les notifications échouent
      }
    }

    return NextResponse.json({
      article: updatedArticle,
      message: "Article mis à jour avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un article
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
    // Vérifier si l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer l'article
    await prisma.article.delete({
      where: { id: id }
    });

    return NextResponse.json({
      message: "Article supprimé avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 