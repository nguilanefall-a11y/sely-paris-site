import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Register custom fonts if needed, but we'll use standard Helvetica for reliability
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjQ.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjQ.ttf', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 70, // Ensure content never overlaps the footer
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#000000',
  },
  logoAccent: {
    width: 30,
    height: 2,
    backgroundColor: '#000000',
    marginTop: 4,
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#666666',
  },
  clientInfo: {
    width: 200,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientText: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  quoteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textTransform: 'uppercase',
    color: '#000000',
  },
  quoteMetaRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  quoteMetaCol: {
    marginRight: 40,
  },
  metaLabel: {
    fontSize: 9,
    color: '#888888',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    padding: '8 8',
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 1.5, textAlign: 'right' },
  colTotal: { flex: 1.5, textAlign: 'right' },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  totalsBox: {
    width: 270,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 4,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
  },
  totalLabel: {
    fontSize: 10,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalValueFinal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  depositBox: {
    marginTop: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#f8fafc',
  },
  depositText: {
    fontSize: 8.5,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  conditions: {
    marginTop: 20,
    fontSize: 8,
    color: '#666666',
    lineHeight: 1.4,
  },
  signatureBox: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signatureArea: {
    width: 250,
    height: 60,
    backgroundColor: '#fafafa',
    borderLeftWidth: 2,
    borderLeftColor: '#000000',
    borderLeftStyle: 'solid',
    padding: 8,
  },
  signatureText: {
    fontSize: 8.5,
    color: '#555555',
    fontFamily: 'Helvetica-Oblique',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: '#999999',
    lineHeight: 1.5,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
  }
});

const renderPremiumDescription = (text) => {
  if (!text) return null;

  // Split by manual newlines
  const blocks = text.split('\n');

  return (
    <View style={{ marginTop: 4 }}>
      {blocks.map((block, i) => {
        if (!block.trim()) return null;

        let formattedBlock = block;
        
        // Single powerful regex to capture either "Lundi 3 août" OR "3 août" OR "Le 3 août"
        // and add a newline before it, without double-matching.
        formattedBlock = formattedBlock.replace(/(?:(?:\b(?:Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche|Le)\s+)?\b\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre))/gi, '\n$&');
        
        // Key terms
        formattedBlock = formattedBlock.replace(/(Temps total|Tout dépassement|Acompte|Solde|Note|Important|Remarque|Attention)/gi, '\n$&');

        // Split and clean up lines
        const subLines = formattedBlock.split('\n').map(l => l.trim()).filter(Boolean);

        return (
          <View key={i} style={{ marginBottom: 2 }}>
            {subLines.map((line, j) => {
              const colonIndex = line.indexOf(':');
              
              // If there's a colon early in the line (like a Date or short title)
              if (colonIndex > 0 && colonIndex < 60) {
                const prefix = line.substring(0, colonIndex + 1);
                const rest = line.substring(colonIndex + 1);
                return (
                  <View key={j} style={{ 
                    flexDirection: 'row', 
                    marginBottom: 4, 
                    marginTop: 2,
                    paddingLeft: 6, 
                    borderLeftWidth: 1.5, 
                    borderLeftColor: '#000000',
                    borderLeftStyle: 'solid'
                  }}>
                    <Text style={{ flex: 1, fontSize: 8.5, color: '#333333', lineHeight: 1.4 }}>
                      <Text style={{ fontFamily: 'Helvetica-Bold', color: '#000000' }}>{prefix}</Text>
                      {rest}
                    </Text>
                  </View>
                );
              }

              // Regular line without colon
              return (
                <View key={j} style={{ marginBottom: 3 }}>
                  <Text style={{ fontSize: 8.5, color: '#555555', lineHeight: 1.4 }}>
                    {line}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

const QuotePDFTemplate = ({ quote, settings }) => {
  const items = quote.items || [];
  
  const totalHT = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tvaRate = quote.tvaRate || 10;
  const tvaAmount = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + tvaAmount;
  const deposit = totalTTC * 0.3; // 30% acompte

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
              <Svg width="36" height="36" viewBox="0 0 32 32">
                <Path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" stroke="#000000" strokeWidth="1" />
                <Path d="M16 8L8 12V20L16 24L24 20V12L16 8Z" stroke="#000000" strokeWidth="0.5" opacity="0.6"/>
                <Path d="M16 2V8M2 9L8 12M30 9L24 12M16 30V24M2 23L8 20M30 23L24 20" stroke="#000000" strokeWidth="0.5" opacity="0.4"/>
              </Svg>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 2, color: '#000000' }}>SELY</Text>
                <Text style={{ fontSize: 7, fontWeight: 'bold', letterSpacing: 3, color: '#555555', marginTop: 2 }}>CHAUFFEUR</Text>
              </View>
            </View>
            <Text style={styles.companyInfo}>{settings.legalForm}</Text>
            {settings.exploitePar && <Text style={styles.companyInfo}>Exploité par {settings.exploitePar}</Text>}
            <Text style={styles.companyInfo}>{settings.address}</Text>
            <Text style={styles.companyInfo}>{settings.email}</Text>
            <Text style={styles.companyInfo}>{settings.website}</Text>
          </View>
          
          <View style={styles.clientInfo}>
            <Text style={styles.metaLabel}>Client {quote.clientType === 'pro' ? '(Professionnel)' : '(Particulier)'}</Text>
            
            {(quote.clientFirstName || quote.clientLastName) ? (
              <Text style={styles.clientName}>
                {[quote.clientFirstName, quote.clientLastName].filter(Boolean).join(' ')}
              </Text>
            ) : null}

            {quote.clientCompany && (
              <Text style={(quote.clientFirstName || quote.clientLastName) ? styles.clientText : styles.clientName}>
                {quote.clientCompany}
              </Text>
            )}
            
            <Text style={styles.clientText}>{quote.clientAddress}</Text>
            {quote.clientEmail && <Text style={styles.clientText}>{quote.clientEmail}</Text>}
            {quote.clientPhone && <Text style={styles.clientText}>{quote.clientPhone}</Text>}
            {quote.clientType === 'pro' && quote.clientVat && (
              <Text style={styles.clientText}>TVA: {quote.clientVat}</Text>
            )}
          </View>
        </View>

        {/* QUOTE META */}
        <Text style={styles.quoteTitle}>DEVIS N° {quote.quoteNumber}</Text>
        <View style={styles.quoteMetaRow}>
          <View style={styles.quoteMetaCol}>
            <Text style={styles.metaLabel}>Date du devis</Text>
            <Text style={styles.metaValue}>
              {quote.createdAt ? format(new Date(quote.createdAt), 'dd MMMM yyyy', { locale: fr }) : '-'}
            </Text>
          </View>
          <View style={styles.quoteMetaCol}>
            <Text style={styles.metaLabel}>Validité</Text>
            <Text style={styles.metaValue}>15 jours</Text>
          </View>
        </View>

        {/* ITEMS TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Désignation</Text>
            <Text style={styles.colQty}>Qté</Text>
            <Text style={styles.colPrice}>Prix U. HT</Text>
            <Text style={styles.colTotal}>Total HT</Text>
          </View>
          
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 2 }}>{item.title}</Text>
                {renderPremiumDescription(item.description)}
              </View>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>{item.price.toFixed(2)} €</Text>
              <Text style={styles.colTotal}>{(item.price * item.qty).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} wrap={false}>
          {/* LEFT COLUMN: CONDITIONS & PAYMENT INFO */}
          <View style={{ width: 250 }}>
            {(quote.conditions !== undefined ? quote.conditions : settings.cancellationPolicy) ? (
              <View style={{ marginTop: 0, fontSize: 8, color: '#666666', lineHeight: 1.4 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 4, color: '#000000' }}>Conditions Générales</Text>
                <Text>{quote.conditions !== undefined ? quote.conditions : settings.cancellationPolicy}</Text>
              </View>
            ) : null}

            {/* BANK DETAILS */}
            <View style={{ marginTop: 15, fontSize: 7.5, color: '#666666', lineHeight: 1.5 }}>
              <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 3, color: '#000000' }}>Règlement par virement bancaire</Text>
              <Text>Titulaire : AM AUTO</Text>
              <Text>IBAN : FR76 1695 8000 0115 2260 2528 106</Text>
              <Text>BIC : QNTOFRP1XXX</Text>
            </View>
          </View>

          {/* RIGHT COLUMN: TOTALS AND SIGNATURE */}
          <View style={{ width: 250 }}>
            {/* TOTALS */}
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total HT</Text>
                <Text style={styles.totalValue}>{totalHT.toFixed(2)} €</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TVA ({tvaRate}%)</Text>
                <Text style={styles.totalValue}>{tvaAmount.toFixed(2)} €</Text>
              </View>
              <View style={styles.totalRowFinal}>
                <Text style={styles.totalLabel}>TOTAL TTC</Text>
                <Text style={styles.totalValueFinal}>{totalTTC.toFixed(2)} €</Text>
              </View>
              
              <View style={styles.depositBox}>
                <Text style={styles.depositText}>Acompte à régler à la validation du devis : {deposit.toFixed(2)} € (30%)</Text>
              </View>
            </View>

            {/* SIGNATURE */}
            <View style={{ marginTop: 40 }}>
              <View style={styles.signatureArea}>
                <Text style={styles.signatureText}>Bon pour accord, le :</Text>
                <Text style={styles.signatureText}>Signature et cachet du client</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <Text style={styles.footer} fixed>
          SIRET : {settings.siret} - TVA Intracommunautaire : {settings.vat} - {settings.website}
        </Text>
      </Page>
    </Document>
  );
};

export default QuotePDFTemplate;
