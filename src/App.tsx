import { useState } from "react";
import "./App.css";
import Editor from "./editor";
import Controls from "./editor/controls";
import { PdfViewer } from "./pdf";

function App() {
  // for onchange event
  const [pdfFile, setPdfFile] = useState<any>();
  const [pdfFileError, setPdfFileError] = useState("");

  // for submit event
  const [viewPdf, setViewPdf] = useState(null);

  const fileType = ["application/pdf"];
  const handlePdfFileChange = (e: any) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          // @ts-nocheck
          setPdfFile(e?.target?.result);
          setPdfFileError("");
        };
      } else {
        setPdfFile(null);
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };

  return (
    <div className="App">
      <div>
        <label id="file_upload">Choose A file</label>
        <input
          onChange={handlePdfFileChange}
          type="file"
          id="file_upload"
          name="file_upload"
          accept=".pdf"
        ></input>
      </div>

      {/* <DocumentUrl /> */}
      <canvas
        style={{
          // boxShadow: '2px 4px 18px 1px #3b3b3b29',
          position: "absolute",
          bottom: "100%",
          right: "100%",
        }}
        id="canvas"
      ></canvas>
      <Editor>
        {pdfFile && <PdfViewer fileUrl={pdfFile} />}
        <Controls />
      </Editor>
      {/* <MyDocument /> */}
    </div>
  );
}

export default App;
