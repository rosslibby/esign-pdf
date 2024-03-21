import './App.css'
import { PdfViewer } from './pdf'
import { MyDocument } from './pdf/render'

function App() {
  return (
    <div>
      <canvas style={{
        // boxShadow: '2px 4px 18px 1px #3b3b3b29',
        position: 'absolute',
        bottom: '100%',
        right: '100%',
      }} id="canvas"></canvas>
      <PdfViewer fileUrl='./document.pdf' />
      {/* <MyDocument /> */}
    </div>
  )
}

export default App
