import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Create styles
const styles = StyleSheet.create({
  document: {
  },
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
  },
  image: {
    aspectRatio: '8.5 / 11',
    width: '100%',
  }
})

// Create Document Component
export const MyDocument = ({ imgSrc }: {
  imgSrc: string
}) => (
  <Document style={styles.document}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <img style={styles.image} src={imgSrc} />
      </View>
    </Page>
  </Document>
)
