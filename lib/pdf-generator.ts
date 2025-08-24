import puppeteer from 'puppeteer';
import { AnalyticsData } from './analytics';

/**
 * Génère un PDF des analytics
 */
export async function generateAnalyticsPDF(
  analyticsData: AnalyticsData, 
  title: string = 'Rapport Analytics'
): Promise<Buffer> {
  try {
    console.log('📊 [PDF GENERATOR] Génération du PDF des analytics...');
    
    // Lancer le navigateur
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Générer le HTML du rapport
    const htmlContent = generateAnalyticsHTML(analyticsData, title);
    
    // Définir le contenu de la page
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
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
    
    await browser.close();
    
    console.log('✅ [PDF GENERATOR] PDF généré avec succès');
    return Buffer.from(pdfBuffer);
    
  } catch (error) {
    console.error('❌ [PDF GENERATOR] Erreur lors de la génération du PDF:', error);
    throw error;
  }
}

/**
 * Génère le HTML pour le rapport PDF
 */
function generateAnalyticsHTML(analyticsData: AnalyticsData, title: string): string {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
          background: #fff;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #667eea;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #667eea;
          margin: 0;
          font-size: 28px;
        }
        
        .header .date {
          color: #666;
          font-size: 14px;
          margin-top: 10px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        
        .stat-number {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }
        
        .stat-label {
          color: #666;
          font-size: 14px;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section h2 {
          color: #333;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        .table th,
        .table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        
        .table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }
        
        .table tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        .percentage {
          background: #667eea;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="date">Généré le ${currentDate}</div>
      </div>
      
      <!-- Statistiques principales -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">${analyticsData.pageViews.toLocaleString()}</div>
          <div class="stat-label">Vues de pages</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${analyticsData.uniqueVisitors.toLocaleString()}</div>
          <div class="stat-label">Visiteurs uniques</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${analyticsData.sessions.toLocaleString()}</div>
          <div class="stat-label">Sessions</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${analyticsData.avgSessionDuration > 0 
            ? `${Math.floor(analyticsData.avgSessionDuration / 60)}m ${analyticsData.avgSessionDuration % 60}s`
            : "0s"
          }</div>
          <div class="stat-label">Durée moyenne</div>
        </div>
      </div>
      
      <!-- Pages les plus visitées -->
      <div class="section">
        <h2>Pages les plus visitées</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Page</th>
              <th>Vues</th>
              <th>Visiteurs uniques</th>
              <th>Temps moyen</th>
            </tr>
          </thead>
          <tbody>
            ${analyticsData.topPages.map((page, index) => `
              <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${page.page}</td>
                <td>${page.views.toLocaleString()}</td>
                <td>${page.uniqueVisitors.toLocaleString()}</td>
                <td>${page.avgTimeOnPage > 0 
                  ? `${Math.floor(page.avgTimeOnPage / 60)}m ${page.avgTimeOnPage % 60}s`
                  : "0s"
                }</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <!-- Répartition par appareil -->
      <div class="section">
        <h2>Répartition par appareil</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Appareil</th>
              <th>Pourcentage</th>
            </tr>
          </thead>
          <tbody>
            ${analyticsData.deviceBreakdown.map(device => `
              <tr>
                <td>${device.device}</td>
                <td><span class="percentage">${device.percentage}%</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <!-- Sources de trafic -->
      <div class="section">
        <h2>Sources de trafic</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Pourcentage</th>
            </tr>
          </thead>
          <tbody>
            ${analyticsData.trafficSources.map(source => `
              <tr>
                <td>${source.source}</td>
                <td><span class="percentage">${source.percentage}%</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <!-- Données quotidiennes -->
      <div class="section">
        <h2>Évolution quotidienne</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vues</th>
              <th>Visiteurs</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            ${analyticsData.dailyData.map(day => `
              <tr>
                <td>${day.date}</td>
                <td>${day.views.toLocaleString()}</td>
                <td>${day.visitors.toLocaleString()}</td>
                <td>${day.sessions.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="footer">
        <p>Rapport généré automatiquement par TechAnswers</p>
        <p>Données basées sur les 90 derniers jours</p>
      </div>
    </body>
    </html>
  `;
} 