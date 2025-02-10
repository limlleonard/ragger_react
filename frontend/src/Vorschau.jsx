import React, { useState, useEffect, useRef } from 'react';
import {Viewer, Worker,  RenderPage, RenderPageProps} from '@react-pdf-viewer/core'

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

// import * as pdfjsLib from "pdfjs-dist";
// import "pdfjs-dist/build/pdf.worker.mjs";

import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

const Vorschau=({selectedFile, pageNr})=>{
	const [file, setFile] = useState([]);
	const fileType=['application/pdf'];
    const pluginNav = pageNavigationPlugin();

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

    useEffect(()=>{
        console.log(pageNr);
        pluginNav.jumpToPage(pageNr-1);
    }, [pageNr])

    return (
		<div id="ctn-pdf" >
            {file === null && <p>PDF Vorschau</p>}
            {file && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={file} defaultScale={1} plugins={[pluginNav]}></Viewer>
                </Worker>
            )}
		</div>
    );
}
export default Vorschau;
// <canvas id="canvas"></canvas>
// plugins={[defaultLayoutPluginInstance]}

// renderPage={renderPage}