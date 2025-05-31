// components/ReportPDF.jsx
import { Document, Page, View, Text, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Définir les styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 20
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#3b82f6',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  chartContainer: {
    marginVertical: 15,
    height: 200
  },
  // Ajoutez d'autres styles selon vos besoins
});

const ReportPDF = ({ analysisData }) => {
  // Traitez vos données comme dans votre composant principal
  const biases = analysisData.filter(item => item.type !== "Sentiment");
  const sentiment = analysisData.find(item => item.type === "Sentiment");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Rapport d'Analyse des Biais</Text>
        </View>

        {/* Résumé */}
        <View style={styles.card}>
          <Text>Biais détectés: {biases.length}</Text>
          {/* Ajoutez d'autres métriques */}
        </View>

        {/* Détails des biais */}
        {biases.map((bias, index) => (
          <View key={index} style={styles.card}>
            <Text style={{ fontWeight: 'bold' }}>{bias.type}</Text>
            <Text>{bias.description}</Text>
            <Text>Score: {parseFloat(bias.description.match(/\d+/)[0])}%</Text>
          </View>
        ))}

        {/* Sentiment */}
        {sentiment && (
          <View style={styles.card}>
            <Text>Sentiment: {sentiment.description.split('(')[0].trim()}</Text>
            <Text>Confiance: {parseFloat(sentiment.description.match(/\d+/)[0])}%</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ReportPDF;