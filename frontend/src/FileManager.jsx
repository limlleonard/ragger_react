import React, { useState, useEffect, useRef } from 'react';
const url0="http://127.0.0.1:5000/"
const FileManager=({onSelectPDF, onChangePage})=>{
	const [files, setFiles] = useState([]);
	const [selectedFileIndex, setSelectedFileIndex] = useState("");
	useEffect(() => {
		const dropArea = document.getElementById('drop-area');
		dropArea.addEventListener('click', () => {document.getElementById('fileElem').click();});
		dropArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files), false);
		['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
			dropArea.addEventListener(eventName, preventDefaults, false);
		});
		/** Prevent default behaviors for drag and drop events, which opens up pdf files in the browser */
		function preventDefaults (e) {
			e.preventDefault();
			e.stopPropagation();
		}
	}, []);

	const handleFiles = async (event) => {
		const arrFile = Array.from(event.target.files);
		setFiles(arrFile);
		const selectedFile = arrFile[0]; 
		onSelectPDF(selectedFile);

		// upload file or later use temp files
		const formData = new FormData();
		for (const file of arrFile) {
			if (formData && file instanceof File) {
				formData.append('file', file);
			}
		}
        const options = {
            method: "POST",
            body: formData
        }
		try {
			const response = await fetch(url0+"upload", options);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Error occurred");
			}
			alert(data.lst_filename);
		} catch (error) {
			console.log("Error:", error);
			alert(error.message);
		}
	};
	const deletePDF = async () => {
		setFiles([]);
		onSelectPDF(null);
		// delete file in pdf folder
		try {
			const response = await fetch(url0+"delete_pdf", {method: "POST"});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Error occurred");
			}
			alert('file deleted');
		} catch (error) {
			console.log("Error:", error);
			alert(error.message);
		}
	};
	const selectPDF = (event) => {
		const index = event.target.value; // Get the index of the selected option
		setSelectedFileIndex(index); // Store the selected index
	
		const selectedFile = files[index]; 
		onSelectPDF(selectedFile);
	};
	const test1=()=>{
		onChangePage(2);
		console.log('test1');
	}
  
    return (
		<>
		<div id="ctn-dragNbutton">
			<div id="drop-area">
				Drag & Drop PDF oder klicken
				<input id="fileElem" type="file" multiple accept="application/pdf" onChange={handleFiles} />
			</div>
			<button type="button" onClick={deletePDF}>PDF Löschen</button>
		</div>
		<div id="ctn-select">
			<label htmlFor="selectPDF">PDF Dateien: </label>
			<div id="ctn-select-rp">
			<select id="selectPDF" value={selectedFileIndex} onChange={selectPDF}>
				{files.map((file, index) => (
				<option key={index} value={index}>{file.name}</option>
				))}
			</select>
			</div>
		</div>
		<button type="button" onClick={test1}>test1</button>
		</>
    );
}
export default FileManager;
// ctn-select-rp ist benutzt für das Styling für Dateien mit einem langen Name