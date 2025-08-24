import puppeteer from 'puppeteer';
import { prisma } from './prisma';

interface InvoiceData {
  invoiceNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  articleId: string;
  articleTitle: string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  paidAt: Date;
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Générer le HTML de la facture
    const htmlContent = generateInvoiceHTML(invoiceData);
    
    await page.setContent(htmlContent);
    
    // Générer le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

function generateInvoiceHTML(data: InvoiceData): string {
  const invoiceDate = data.paidAt.toLocaleDateString('fr-FR');
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Facture ${data.invoiceNumber}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-info {
          float: left;
          width: 50%;
        }
        .invoice-info {
          float: right;
          width: 40%;
          text-align: right;
        }
        .clear {
          clear: both;
        }
        .client-info {
          margin-bottom: 30px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .invoice-table th,
        .invoice-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .invoice-table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .total-row {
          font-weight: bold;
          background-color: #f8f9fa;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .legal-notice {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
          font-size: 11px;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 60px;
          color: rgba(37, 99, 235, 0.1);
          z-index: -1;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="watermark">FACTURÉ</div>
      
      <div class="header">
        <div class="company-info">
          <h1 style="color: #2563eb; margin: 0;">Oxelya</h1>
          <p style="margin: 5px 0;">
            <strong>Adresse :</strong><br>
            32 Rue de Cantelaude<br>
            33380 Marcheprime, France
          </p>
          <p style="margin: 5px 0;">
            <strong>Email :</strong> contact@oxelya.com<br>
            <strong>Téléphone :</strong> +33 6 43 32 34 12
          </p>
          <p style="margin: 5px 0;">
            <strong>SIRET : 98933767000016</strong> <br>
            <strong>TVA :</strong> FR38989337670
          </p>
        </div>
        
        <div class="invoice-info">
          <h2 style="color: #2563eb; margin: 0;">FACTURE</h2>
          <p style="margin: 5px 0;">
            <strong>N° Facture :</strong> ${data.invoiceNumber}<br>
            <strong>Date :</strong> ${invoiceDate}<br>
            <strong>Échéance :</strong> ${invoiceDate}
          </p>
        </div>
        <div class="clear"></div>
      </div>

      <div class="client-info">
        <h3>Facturé à :</h3>
        <p>
          <strong>${data.userName}</strong><br>
          Email : ${data.userEmail}<br>
          Client ID : ${data.userId}
        </p>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${data.articleTitle}</td>
            <td>1</td>
            <td>${data.amount.toFixed(2)} ${data.currency.toUpperCase()}</td>
            <td>${data.amount.toFixed(2)} ${data.currency.toUpperCase()}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;"><strong>Total TTC :</strong></td>
            <td><strong>${data.amount.toFixed(2)} ${data.currency.toUpperCase()}</strong></td>
          </tr>
        </tfoot>
      </table>

      <div class="legal-notice">
        <h4>Informations légales :</h4>
        <ul>
          <li>Cette facture est payable immédiatement</li>
          <li>Pas d'escompte en cas de paiement anticipé</li>
          <li>En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée</li>
          <li>Une indemnité forfaitaire de 40€ pour frais de recouvrement sera due</li>
          <li>Conformément à l'article L.441-6 du Code de commerce</li>
        </ul>
      </div>

      <div class="footer">
        <p>
          <strong>Mode de paiement :</strong> Carte bancaire via Stripe<br>
          <strong>Référence de paiement :</strong> ${data.stripePaymentIntentId}<br>
          <strong>Statut :</strong> Payé le ${invoiceDate}
        </p>
        <p>
          Oxelya - SIRET : 98933767000016 - TVA : FR38989337670<br>
          Cette facture est générée automatiquement et fait foi de preuve de paiement.
        </p>
      </div>
    </body>
    </html>
  `;
}

export async function createInvoiceFromPayment(
  userId: string,
  articleId: string,
  stripePaymentIntentId: string,
  amount: number,
  currency: string = 'eur'
): Promise<string> {
  try {
    // Récupérer les informations utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, username: true, firstName: true, lastName: true }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Récupérer les informations de l'article
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { title: true }
    });

    if (!article) {
      throw new Error('Article non trouvé');
    }

    // Générer le numéro de facture
    const invoiceNumber = generateInvoiceNumber();

    // Créer la facture en base
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber,
        stripeInvoiceId: stripePaymentIntentId,
        amount,
        currency,
        taxAmount: 0, // Pas de TVA pour les services numériques
        totalAmount: amount,
        status: 'PAID',
        paidAt: new Date(),
        items: {
          create: {
            articleId,
            description: article.title,
            quantity: 1,
            unitPrice: amount,
            totalPrice: amount
          }
        }
      },
      include: {
        items: true
      }
    });

    // Créer l'historique d'achat
    const payment = await prisma.payment.findFirst({
      where: {
        stripePaymentIntentId: stripePaymentIntentId
      }
    });

    if (payment) {
      await prisma.purchaseHistory.create({
        data: {
          userId,
          articleId,
          paymentId: payment.id,
          price: amount,
          currency,
          purchaseDate: new Date()
        }
      });
    }

    console.log(`✅ Facture créée : ${invoiceNumber} pour l'utilisateur ${userId}`);

    return invoice.id;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la facture:', error);
    throw error;
  }
}

function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `FA-${year}${month}-${random}`;
}

export async function getInvoicePDF(invoiceId: string): Promise<Buffer | null> {
  try {
    console.log(`🔍 Génération PDF pour la facture: ${invoiceId}`);
    
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: true,
        items: {
          include: {
            article: true
          }
        }
      }
    });

    if (!invoice) {
      console.error(`❌ Facture non trouvée: ${invoiceId}`);
      return null;
    }

    console.log(`📋 Facture trouvée:`, {
      invoiceNumber: invoice.invoiceNumber,
      userId: invoice.userId,
      userEmail: invoice.user?.email,
      itemsCount: invoice.items?.length || 0
    });

    // Validation des données
    if (!invoice.user) {
      console.error('❌ Utilisateur non trouvé pour la facture');
      return null;
    }

    if (!invoice.items || invoice.items.length === 0) {
      console.error('❌ Aucun article trouvé pour la facture');
      return null;
    }

    const invoiceData: InvoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      userId: invoice.userId,
      userEmail: invoice.user.email,
      userName: `${invoice.user.firstName || ''} ${invoice.user.lastName || ''}`.trim() || invoice.user.username,
      articleId: invoice.items[0]?.articleId || '',
      articleTitle: invoice.items[0]?.article?.title || 'Article inconnu',
      amount: invoice.totalAmount,
      currency: invoice.currency,
      stripePaymentIntentId: invoice.stripeInvoiceId || '',
      paidAt: invoice.paidAt || new Date()
    };

    console.log(`📄 Données de facture préparées:`, invoiceData);

    const pdfBuffer = await generateInvoicePDF(invoiceData);
    
    if (!pdfBuffer) {
      console.error('❌ Échec de la génération du PDF');
      return null;
    }

    console.log(`✅ PDF généré avec succès, taille: ${pdfBuffer.length} bytes`);
    return pdfBuffer;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error);
    return null;
  }
} 