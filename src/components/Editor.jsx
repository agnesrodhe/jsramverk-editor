import { TrixEditor } from "react-trix";
import React, { useState } from 'react';
import "trix";
import "trix/dist/trix.css";
import docsModel from '../models/docs';
import { useEffect } from "react";
import Save from './Save';
import Create from './Create';
import DropDown from "./DropDown";

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
    }, []);

    useEffect(() => {
        (async () => {
            setEditorContent(currentDoc.text);
        })();
    }, [currentDoc]);

    async function choosenDoc(e) {
        const id = e.target.value.trim().toString();
        console.log(id, docs[id]);
        if (id !== "-99") {
            await setCurrentDoc(docs[id]);
        } else {
            setCurrentDoc({_id: null, name:"", text:""});
        }
    }

    function setEditorContent(content) {
        let element = document.querySelector("trix-editor");
        element.value = "";
        element.editor.setSelectedRange([0, 0]);
        element.editor.insertHTML(content);
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
                <Save onClick={saveDoc} />
                <Create onClick={createDoc} />
                <DropDown onChange={choosenDoc} docs={docs} />
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
