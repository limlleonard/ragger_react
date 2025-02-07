import React, { useState, useEffect, useRef } from 'react';
import {Viewer, Worker,  RenderPage, RenderPageProps} from '@react-pdf-viewer/core'

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"; // scroll to page
import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/core/lib/styles/index.css'
// import '@react-pdf-viewer/default-layout/lib/styles/index.css'

// import * as pdfjsLib from "pdfjs-dist";
// import "pdfjs-dist/build/pdf.worker.mjs";

const Vorschau=({selectedFile, pageNr})=>{
	const [file, setFile] = useState([]);
	const fileType=['application/pdf'];
	const viewerRef = useRef(null);

	useEffect(() => {
        // react pdf viewer
		const selected=selectedFile;
		if (selected) {
			if (fileType.includes(selected.type)) {
				let reader=new FileReader();
				reader.readAsDataURL(selected);
				reader.onload=(e)=>{
					setFile(e.target.result)
				};
			}
		} else {setFile(null);}
	}, [selectedFile]);

    const renderPage = (props) => (
        <>
            {props.canvasLayer.children}
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                }}
            >
            </div>
            {props.annotationLayer.children}
            {props.textLayer.children}
        </>
    );

	useEffect(() => {
		goToPage(pageNr);
	}, [pageNr]);
	
    // const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const goToPage = (pageNr) => {
        if (viewerRef.current) {
            viewerRef.current.jumpToPage(pageNr - 1); // Pages are 0-indexed
        }
    };

    return (
		<div id="ctn-pdf" >
            {file === null && <p>PDF Vorschau</p>}
            {file && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={file} renderPage={renderPage}  ></Viewer>
                </Worker>
            )}
		</div>
    );
}
export default Vorschau;
// <canvas id="canvas"></canvas>
// plugins={[defaultLayoutPluginInstance]}