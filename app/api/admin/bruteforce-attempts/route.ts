import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAsync } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const admin = await requireAdminAsync(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status"); // "blocked", "active", "all"

    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    
    if (status === "blocked") {
      where.isBlocked = true;
      where.blockedUntil = { gt: new Date() };
    } else if (status === "active") {
      where.OR = [
        { isBlocked: true, blockedUntil: { gt: new Date() } },
        { attempts: { gte: 1 } }
      ];
    }

    // Récupérer les tentatives
    const [attempts, total] = await Promise.all([
      prisma.bruteforceAttempt.findMany({
        where,
        orderBy: { lastAttempt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          ip: true,
          userAgent: true,
          fingerprint: true,
          attempts: true,
          lastAttempt: true,
          isBlocked: true,
          blockedUntil: true,
          browser: true,
          os: true,
          createdAt: true,
          updatedAt: true,
        }
      }),
      prisma.bruteforceAttempt.count({ where })
    ]);

    // Statistiques
    const stats = await prisma.bruteforceAttempt.aggregate({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Dernières 24h
        }
      },
      _count: {
        id: true
      },
      _sum: {
        attempts: true
      }
    });

    const blockedCount = await prisma.bruteforceAttempt.count({
      where: {
        isBlocked: true,
        blockedUntil: { gt: new Date() }
      }
    });

    return NextResponse.json({
      attempts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        totalAttempts: stats._count.id,
        totalFailedLogins: stats._sum.attempts || 0,
        currentlyBlocked: blockedCount
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des tentatives:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const admin = await requireAdminAsync(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Supprimer une tentative spécifique
      await prisma.bruteforceAttempt.delete({
        where: { id }
      });
    } else {
      // Supprimer toutes les tentatives expirées
      await prisma.bruteforceAttempt.deleteMany({
        where: {
          OR: [
            { blockedUntil: { lt: new Date() } },
            { attempts: 0 }
          ]
        }
      });
    }

    return NextResponse.json({ message: "Suppression réussie" });

  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 