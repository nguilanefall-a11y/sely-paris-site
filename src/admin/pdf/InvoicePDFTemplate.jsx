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
    backgroundColor: '#c4a165',
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
    borderColor: '#eeeeee',
    backgroundColor: '#ffffff',
  },
  depositBoxGold: {
    marginTop: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#c4a165',
    backgroundColor: '#fffcf5',
  },
  depositText: {
    fontSize: 8.5,
    color: '#666666',
    textAlign: 'center',
  },
  depositTextGold: {
    fontSize: 9,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
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

  const blocks = text.split('\n');

  return (
    <View style={{ marginTop: 4 }}>
      {blocks.map((block, i) => {
        if (!block.trim()) return null;

        let formattedBlock = block;
        formattedBlock = formattedBlock.replace(/(?:(?:\b(?:Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche|Le)\s+)?\b\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre))/gi, '\n$&');
        formattedBlock = formattedBlock.replace(/(Temps total|Tout dépassement|Acompte|Solde|Note|Important|Remarque|Attention)/gi, '\n$&');

        const subLines = formattedBlock.split('\n').map(l => l.trim()).filter(Boolean);

        return (
          <View key={i} style={{ marginBottom: 2 }}>
            {subLines.map((line, j) => {
              const colonIndex = line.indexOf(':');
              
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
                    borderLeftColor: '#c4a165',
                    borderLeftStyle: 'solid'
                  }}>
                    <Text style={{ flex: 1, fontSize: 8.5, color: '#333333', lineHeight: 1.4 }}>
                      <Text style={{ fontFamily: 'Helvetica-Bold', color: '#000000' }}>{prefix}</Text>
                      {rest}
                    </Text>
                  </View>
                );
              }

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

const InvoicePDFTemplate = ({ invoice, settings }) => {
  const items = invoice.items || [];
  
  const totalHT = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tvaRate = invoice.tvaRate || 10;
  const tvaAmount = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + tvaAmount;
  const deposit = invoice.deposit || (totalTTC * 0.3); // 30% acompte usually paid
  const remaining = totalTTC - deposit;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
              <Svg width="36" height="36" viewBox="0 0 32 32">
                <Path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" stroke="#c4a165" strokeWidth="1" />
                <Path d="M16 8L8 12V20L16 24L24 20V12L16 8Z" stroke="#c4a165" strokeWidth="0.5" opacity="0.6"/>
                <Path d="M16 2V8M2 9L8 12M30 9L24 12M16 30V24M2 23L8 20M30 23L24 20" stroke="#c4a165" strokeWidth="0.5" opacity="0.4"/>
              </Svg>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 2, color: '#000000' }}>SELY</Text>
                <Text style={{ fontSize: 7, fontWeight: 'bold', letterSpacing: 3, color: '#c4a165', marginTop: 2 }}>CHAUFFEUR</Text>
              </View>
            </View>
            <Text style={styles.companyInfo}>{settings.legalForm}</Text>
            {settings.exploitePar && <Text style={styles.companyInfo}>Exploité par {settings.exploitePar}</Text>}
            <Text style={styles.companyInfo}>{settings.address}</Text>
            <Text style={styles.companyInfo}>{settings.email}</Text>
            <Text style={styles.companyInfo}>{settings.website}</Text>
          </View>
          
          <View style={styles.clientInfo}>
            <Text style={styles.metaLabel}>Client {invoice.clientType === 'pro' ? '(Professionnel)' : '(Particulier)'}</Text>
            
            {(invoice.clientFirstName || invoice.clientLastName) ? (
              <Text style={styles.clientName}>
                {[invoice.clientFirstName, invoice.clientLastName].filter(Boolean).join(' ')}
              </Text>
            ) : null}

            {invoice.clientCompany && (
              <Text style={(invoice.clientFirstName || invoice.clientLastName) ? styles.clientText : styles.clientName}>
                {invoice.clientCompany}
              </Text>
            )}
            
            <Text style={styles.clientText}>{invoice.clientAddress}</Text>
            {invoice.clientEmail && <Text style={styles.clientText}>{invoice.clientEmail}</Text>}
            {invoice.clientPhone && <Text style={styles.clientText}>{invoice.clientPhone}</Text>}
            {invoice.clientType === 'pro' && invoice.clientVat && (
              <Text style={styles.clientText}>TVA: {invoice.clientVat}</Text>
            )}
          </View>
        </View>

        {/* INVOICE META */}
        <Text style={styles.quoteTitle}>FACTURE N° {invoice.invoiceNumber}</Text>
        <View style={styles.quoteMetaRow}>
          <View style={styles.quoteMetaCol}>
            <Text style={styles.metaLabel}>Date de facturation</Text>
            <Text style={styles.metaValue}>
              {invoice.createdAt ? format(new Date(invoice.createdAt), 'dd MMMM yyyy', { locale: fr }) : '-'}
            </Text>
          </View>
          <View style={styles.quoteMetaCol}>
            <Text style={styles.metaLabel}>Échéance</Text>
            <Text style={styles.metaValue}>À réception</Text>
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
            {/* BANK DETAILS */}
            <View style={{ marginTop: 0, fontSize: 7.5, color: '#666666', lineHeight: 1.5 }}>
              <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 3, color: '#000000' }}>Règlement par virement bancaire</Text>
              <Text>Titulaire : AM AUTO</Text>
              <Text>IBAN : FR76 1695 8000 0115 2260 2528 106</Text>
              <Text>BIC : QNTOFRP1XXX</Text>
              <Text style={{ marginTop: 5 }}>Merci de préciser le numéro de facture en libellé.</Text>
            </View>
          </View>

          {/* RIGHT COLUMN: TOTALS */}
          <View style={{ width: 270 }}>
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
                <Text style={styles.depositText}>Acompte déjà réglé : {deposit.toFixed(2)} €</Text>
              </View>
              <View style={styles.depositBoxGold}>
                <Text style={styles.depositTextGold}>Net à payer : {remaining.toFixed(2)} €</Text>
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

export default InvoicePDFTemplate;
