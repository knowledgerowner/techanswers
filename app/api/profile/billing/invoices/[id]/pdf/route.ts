import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { getInvoicePDF } from '@/lib/invoice-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { id } = await params;

    // Vérifier que la facture appartient à l'utilisateur
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId: user.userId
      }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    // Générer le PDF
    console.log(`🔄 Génération du PDF pour la facture ${id}...`);
    const pdfBuffer = await getInvoicePDF(id);

    if (!pdfBuffer) {
      console.error(`❌ Échec de la génération du PDF pour la facture ${id}`);
      return NextResponse.json(
        { error: 'Erreur lors de la génération du PDF. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    console.log(`✅ PDF généré avec succès pour la facture ${id}, taille: ${pdfBuffer.length} bytes`);

    // Retourner le PDF
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${invoice.invoiceNumber}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    );
  }
} 