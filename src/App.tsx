import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
export interface PDFState {
  pdf: [],
  currentPage: number,
  zoom: number
}

const App: FC = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const [currentPage, setCurrentPage] = useState(1)
  const [pdf, setPDF] = useState<any>(null)
  const [scale, setScale] = useState(1)
  const canvas = useRef<HTMLCanvasElement>(null)

  const renderPage = useCallback((num: number) => {
    // Get page
    if (pdf) {
      pdf.getPage(num).then((page: any) => {
        // Set scale
        if (canvas.current) {
          const viewport = page.getViewport({ scale });
          canvas.current.getContext('2d')
          canvas.current.width = viewport.width;
          canvas.current.height = viewport.height;

          const renderCtx = {
            canvasContext: canvas.current.getContext('2d'),
            viewport
          };

          page.render(renderCtx)
        }
      });
    }
  }, [pdf, scale]);

  useEffect(() => {
    pdfjs.getDocument('/docs/test2.pdf').promise.then((res: any) => {
      setPDF(res);
    })
  }, [])
  useEffect(() => {
    renderPage(currentPage);
  }, [pdf, currentPage, scale, renderPage])



  return (
    <div className="app">
      <div id="my_pdf_viewer"></div>
      <div id="canvas_container">
        <canvas id="pdf_renderer" ref={canvas}></canvas>
      </div>
      <div id="navigation_controls">
        <button id="go_previous" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        <input id="current_page" value={currentPage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPage(Number(e.target.value))} type="number" />
        <button id="go_next" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>

      <div id="zoom_controls">
        {scale}
        <button id="zoom_in" onClick={() => setScale(scale + 1)} >+</button>
        <button id="zoom_out" onClick={() => setScale(scale - 1)}>-</button>
      </div>
    </div>
  );
}

export default App;
