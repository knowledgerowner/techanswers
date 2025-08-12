import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientFingerprint } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const fingerprint = getClientFingerprint(request);
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";

    // Vérifier s'il y a une tentative de brute force active
    const bruteforceAttempt = await prisma.bruteforceAttempt.findFirst({
      where: {
        OR: [
          { ip },
          { fingerprint }
        ],
        isBlocked: true,
        blockedUntil: {
          gt: new Date()
        }
      },
      orderBy: {
        lastAttempt: "desc"
      }
    });

    if (bruteforceAttempt) {
      return NextResponse.json({
        isBlocked: true,
        blockedUntil: bruteforceAttempt.blockedUntil,
        attempts: bruteforceAttempt.attempts
      });
    }

    return NextResponse.json({
      isBlocked: false
    });

  } catch (error) {
    console.error("Erreur lors de la vérification du blocage:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 