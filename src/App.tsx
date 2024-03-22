import './App.css'
import Editor from './editor'
import Controls from './editor/controls'
import { PdfViewer } from './pdf'
import { MyDocument } from './pdf/render'
import DocumentUrl from './url'

function App() {
  return (
    <div className="App">
      {/* <DocumentUrl /> */}
      <canvas style={{
        // boxShadow: '2px 4px 18px 1px #3b3b3b29',
        position: 'absolute',
        bottom: '100%',
        right: '100%',
      }} id="canvas"></canvas>
      <Editor>
        <PdfViewer fileUrl='./document.pdf' />
        <Controls />
      </Editor>
      {/* <MyDocument /> */}
    </div>
  )
}

export default App
