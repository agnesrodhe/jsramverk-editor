import { TrixEditor } from "react-trix";
import React, { useState } from 'react';
import "trix";
import "trix/dist/trix.css";
import docsModel from '../models/docs';
import { useEffect } from "react";

function Editor() {
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [message, setMessage] = useState('');
    const [enteredDocName, setEnteredDocName] = useState("");

    async function fetchDoc() {
        const allDocs = await docsModel.getAllDocs();
        setDocs(allDocs);
    }

    useEffect(() => {
        (async () => {
            await fetchDoc();
        })();
    }, [currentDoc]);

    function choosenDoc(e) {
        const id = e.target.value.trim().toString();
        if (id !== "-99") {
            setCurrentDoc(docs[id]);
        } else {
            setCurrentDoc({_id: null, name:"", text:""});
        }
    }

    function setEditorContent(content) {
        console.log(currentDoc.text);
        let element = document.querySelector("trix-editor");
        element.value = "";
        element.editor.setSelectedRange([0, 0]);
        element.editor.insertHTML(content);
    }

    function openDoc() {
        setEditorContent(currentDoc.text);
    }

    async function saveDoc() {
        let newObject = {};
        if (enteredDocName !== "") {
            newObject = {
                "name": enteredDocName,
                "text": message
            };
            await docsModel.createDoc(newObject);
        } else {
            newObject = {
                "name": currentDoc.name,
                "text": message,
                "_id": currentDoc._id
            };
            await docsModel.updateDoc(newObject);
        }
    };

    function createDoc() {
        setEditorContent("");
        const docName = prompt('Dokumentets namn: ');
        setEnteredDocName(docName);
    };

    function handleChange(event) {
        setMessage(event);
    };

    return (
        <div>
            <nav className="App-navbar">
                <button className="saveBtn" onClick={saveDoc}>Spara</button>
                <button className="saveBtn" value="Alert" onClick={createDoc}>Skapa nytt</button>
                <select className="saveBtn" onChange={choosenDoc}>
                <option value="-99" key="0">Välj ett dokument</option>
                {docs.map((doc, index) => <option value={index} key={index}>{doc.name}</option>)}
            </select>
            <button className="saveBtn" onClick={openDoc}>Öppna</button>
            </nav>
            <div className="trixDiv">
                <TrixEditor autoFocus={true}
                    className='trix' 
                    name="message"
                    onChange={handleChange} 
                /> 
            </div>
        </div>
    )
}
export default Editor;
