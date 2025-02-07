import { useState } from "react";
import './App.css'
import Vorschau from "./Vorschau";
import FileManager from "./FileManager";
import QAs from "./QAs";

export default function App() {
	const [selectedFile, setSelectedFile] = useState('');
	const [pageNr, setPageNr] = useState('');

	const handleSelectPDF = (file) => {
		setSelectedFile(file);
	};
	const handleChangePage = (nr) => {
		setPageNr(nr);
	};

	return (
		<div className="ctn0">
		<p id="warning">(Warning)</p>
		<div className="ctn1 ctn1-center">
			<h2>Ragger</h2>
		</div>
		<div className="ctn1 ctn-lr">
        	<div className="ctn-l">
				<Vorschau selectedFile={selectedFile} pageNr={pageNr} />
			</div>
			<div className="ctn-r">
				<FileManager onSelectPDF={handleSelectPDF} onChangePage={handleChangePage} />
				<QAs />
			</div>
		</div>
		</div>
	);
}

// scroll page: npm install @react-pdf-viewer/core @react-pdf-viewer/default-layout
