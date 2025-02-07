import React, { useState, useEffect, useRef } from 'react';
const url0="http://127.0.0.1:5000/"
const QAs=()=>{
	const [apiKey, setApiKey] = useState("");
	const [question, setQuestion] = useState("");
	const [qaList, setQaList] = useState([
		{ question: "Example question?", answer: "Example answer!" },
	]);

	const addAPI = async (event) => {
		event.preventDefault();
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({apiKey})
        }
		try {
			const response = await fetch(url0+"add_api", options);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Error occurred");
			}
			alert(data.warning);
		} catch (error) {
			console.log("Error:", error);
			alert(error.message);
		}
		// option2
		// fetch(url0+"add_api", options)
		// .then(response => {
		// 	return response.json().then(data => {
		// 	if (!response.ok) {
		// 		throw new Error(data.message || "Error occurred");
		// 	}
		// 	alert(data.warning);
		// 	});
		// })
		// .catch(error => {
		// 	console.log("Error:", error);
		// 	alert(error.message);
		// });
		setApiKey(""); 
	};
	const askQuestion = async (event) => {
		event.preventDefault();
		if (question) {
			const data = {question};
			const url = url0+"frag";
			const options = {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(data)
			}
			try {
				const response = await fetch(url, options);
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.message || "Error occurred");
				}
				setQaList([...qaList, { question, answer: data.answer }]);
				setQuestion("");
			} catch (error) {
				console.error("Error:", error);
				alert(error.message);
			}
		}
	};
	
	return (<>
	<form className="textfield" onSubmit={addAPI}>
		<input
			type="password"
			id="inputAPI"
			name="inputAPI"
			placeholder="API Key für ChatGPT eingeben und 'Enter' klicken"
			value={apiKey}
			onChange={(e) => setApiKey(e.target.value)}
		/>
	</form>
	<div id="ctn-qas1">
		{qaList.map((qa, index) => (
			<React.Fragment key={index}>
			<div className="question"><p>{qa.question}</p></div>
			<div className="answer"><p>{qa.answer}</p></div>
			</React.Fragment>
		))}
	</div>
	<form className="textfield" onSubmit={askQuestion}>
		<input
		type="text"
		id="inputFrage"
		name="inputFrage"
		placeholder="Eine Frage stellen und 'Enter' drücken"
		value={question}
		onChange={(e) => setQuestion(e.target.value)}
		/>
	</form>
	</>);
}
export default QAs;