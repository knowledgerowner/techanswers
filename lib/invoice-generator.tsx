import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { renderToBuffer } from '@react-pdf/renderer';
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

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 12,
  },
  header: {
    borderBottom: '2 solid #2563eb',
    paddingBottom: 20,
    marginBottom: 30,
  },
  companyInfo: {
    width: '50%',
  },
  invoiceInfo: {
    width: '40%',
    textAlign: 'right',
    position: 'absolute',
    right: 30,
  },
  clientInfo: {
    marginTop: 20,
    marginBottom: 30,
  },
  invoiceTable: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    minHeight: 40,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 12,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  tableCellLast: {
    padding: 12,
    flex: 1,
  },
  totalSection: {
    marginTop: 30,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  totalLabel: {
    width: '60%',
    textAlign: 'right',
    paddingRight: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    width: '40%',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 50,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
  },
});

// Fonction qui génère le PDF sans JSX
function createInvoicePDF(data: InvoiceData) {
  const invoiceDate = data.paidAt.toLocaleDateString('fr-FR');
  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: data.currency.toUpperCase(),
  }).format(data.amount);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2563eb', marginBottom: 10 }}>
              Oxelya
            </Text>
            <Text>Entreprise mère de TechAnswers</Text>
            <Text>contact@oxelya.com</Text>
            <Text>www.oxelya.com</Text>
          </View>
          
          <View style={styles.invoiceInfo}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              FACTURE
            </Text>
            <Text>N° {data.invoiceNumber}</Text>
            <Text>Date : {invoiceDate}</Text>
            <Text>Statut : Payé</Text>
          </View>
        </View>

        {/* Informations client */}
        <View style={styles.clientInfo}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>
            Facturé à :
          </Text>
          <Text style={{ marginBottom: 5 }}>{data.userName}</Text>
          <Text style={{ marginBottom: 5 }}>{data.userEmail}</Text>
        </View>

        {/* Tableau des articles */}
        <View style={styles.invoiceTable}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Quantité</Text>
            <Text style={styles.tableCell}>Prix unitaire</Text>
            <Text style={styles.tableCellLast}>Total</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.articleTitle}</Text>
            <Text style={styles.tableCell}>1</Text>
            <Text style={styles.tableCell}>{formattedAmount}</Text>
            <Text style={styles.tableCellLast}>{formattedAmount}</Text>
          </View>
        </View>

        {/* Section des totaux */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total :</Text>
            <Text style={styles.totalValue}>{formattedAmount}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA (0%) :</Text>
            <Text style={styles.totalValue}>0,00 €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontSize: 16 }]}>Total :</Text>
            <Text style={[styles.totalValue, { fontSize: 16, color: '#2563eb' }]}>
              {formattedAmount}
            </Text>
          </View>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text>Merci pour votre confiance !</Text>
          <Text>Cette facture a été générée automatiquement par Oxelya</Text>
          <Text>Pour toute question, contactez-nous à contact@oxelya.com</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  try {
    console.log('🔄 Génération PDF avec React-PDF...');
    
    const pdfBuffer = await renderToBuffer(createInvoicePDF(invoiceData));
    
    console.log(`✅ PDF généré avec succès, taille: ${pdfBuffer.length} bytes`);
    return Buffer.from(pdfBuffer);
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF avec React-PDF:', error);
    throw error;
  }
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