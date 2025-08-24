import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    // Récupérer les statistiques
    const [
      articlesCount,
      usersCount,
      contactsCount,
      bruteforceAttempts,
      blockedIPs
    ] = await Promise.all([
      // Nombre d'articles publiés
      prisma.article.count({
        where: { isPublished: true }
      }),
      
      // Nombre d'utilisateurs
      prisma.user.count(),
      
      // Nombre de messages de contact
      prisma.contact.count(),
      
      // Nombre de tentatives de brute force
      prisma.bruteforceAttempt.count({
        where: { isBlocked: true }
      }),
      
      // Nombre d'IPs actuellement bloquées
      prisma.bruteforceAttempt.count({
        where: {
          isBlocked: true,
          blockedUntil: {
            gt: new Date()
          }
        }
      })
    ]);

    return NextResponse.json({
      stats: {
        articles: articlesCount,
        users: usersCount,
        contacts: contactsCount,
        bruteforceAttempts,
        blockedIPs
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 