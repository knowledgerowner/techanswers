import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { renderToBuffer } from '@react-pdf/renderer';
import { AnalyticsData } from './analytics';

// Styles pour le PDF des analytics
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 12,
  },
  header: {
    textAlign: 'center',
    borderBottom: '3 solid #667eea',
    paddingBottom: 20,
    marginBottom: 30,
  },
  title: {
    color: '#667eea',
    margin: 0,
    fontSize: 28,
  },
  date: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  statCard: {
    width: '45%',
    backgroundColor: '#f8f9fa',
    border: '1 solid #e9ecef',
    borderRadius: 8,
    padding: 20,
    margin: '2.5%',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  statLabel: {
    color: '#666',
    fontSize: 14,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#333',
    borderBottom: '2 solid #667eea',
    paddingBottom: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
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
  percentage: {
    backgroundColor: '#667eea',
    color: 'white',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 12,
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    borderTop: '1 solid #eee',
    paddingTop: 20,
  },
});

// Composant PDF des analytics
function AnalyticsPDF({ data, title }: { data: AnalyticsData; title: string }) {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>Généré le {currentDate}</Text>
        </View>
        
        {/* Statistiques principales */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{data.pageViews.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Vues de pages</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{data.uniqueVisitors.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Visiteurs uniques</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{data.sessions.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {data.avgSessionDuration > 0 
                ? `${Math.floor(data.avgSessionDuration / 60)}m ${data.avgSessionDuration % 60}s`
                : "0s"
              }
            </Text>
            <Text style={styles.statLabel}>Durée moyenne</Text>
          </View>
        </View>

        {/* Pages les plus visitées */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pages les plus visitées</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Rang</Text>
              <Text style={styles.tableCell}>Page</Text>
              <Text style={styles.tableCell}>Vues</Text>
              <Text style={styles.tableCell}>Visiteurs</Text>
              <Text style={styles.tableCellLast}>Temps moyen</Text>
            </View>
            
            {data.topPages.map((page, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>{index + 1}</Text></Text>
                <Text style={styles.tableCell}>{page.page}</Text>
                <Text style={styles.tableCell}>{page.views.toLocaleString()}</Text>
                <Text style={styles.tableCell}>{page.uniqueVisitors.toLocaleString()}</Text>
                <Text style={styles.tableCellLast}>
                  {page.avgTimeOnPage > 0 
                    ? `${Math.floor(page.avgTimeOnPage / 60)}m ${page.avgTimeOnPage % 60}s`
                    : "0s"
                  }
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Répartition par appareil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Répartition par appareil</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Appareil</Text>
              <Text style={styles.tableCellLast}>Pourcentage</Text>
            </View>
            
            {data.deviceBreakdown.map((device, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{device.device}</Text>
                <Text style={styles.tableCellLast}>
                  <Text style={styles.percentage}>{device.percentage}%</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sources de trafic */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sources de trafic</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Source</Text>
              <Text style={styles.tableCellLast}>Pourcentage</Text>
            </View>
            
            {data.trafficSources.map((source, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{source.source}</Text>
                <Text style={styles.tableCellLast}>
                  <Text style={styles.percentage}>{source.percentage}%</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Données quotidiennes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Évolution quotidienne</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Date</Text>
              <Text style={styles.tableCell}>Vues</Text>
              <Text style={styles.tableCell}>Visiteurs</Text>
              <Text style={styles.tableCellLast}>Sessions</Text>
            </View>
            
            {data.dailyData.map((day, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{day.date}</Text>
                <Text style={styles.tableCell}>{day.views.toLocaleString()}</Text>
                <Text style={styles.tableCell}>{day.visitors.toLocaleString()}</Text>
                <Text style={styles.tableCellLast}>{day.sessions.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text>Rapport généré automatiquement par TechAnswers</Text>
          <Text>Données basées sur les 90 derniers jours</Text>
        </View>
      </Page>
    </Document>
  );
}

// Fonction principale de génération de PDF des analytics
export async function generateAnalyticsPDF(
  analyticsData: AnalyticsData, 
  title: string = 'Rapport Analytics'
): Promise<Buffer> {
  try {
    console.log('📊 [PDF GENERATOR] Génération du PDF des analytics...');
    
    const pdfBuffer = await renderToBuffer(<AnalyticsPDF data={analyticsData} title={title} />);
    
    console.log('✅ [PDF GENERATOR] PDF généré avec succès');
    return Buffer.from(pdfBuffer);
    
  } catch (error) {
    console.error('❌ [PDF GENERATOR] Erreur lors de la génération du PDF:', error);
    throw error;
  }
} 