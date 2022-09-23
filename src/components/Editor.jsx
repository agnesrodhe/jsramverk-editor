import { TrixEditor } from "react-trix";
import React, { useState } from 'react';
import "trix";
import "trix/dist/trix.css";
import docsModel from '../models/docs';
import { useEffect } from "react";
import Save from './Save';
import Create from './Create';
import DropDown from "./DropDown";

function Editor({docs, setEditorContent, handleChange, message, fetchDoc, currentDoc, setCurrentDoc}) {
    const [enteredDocName, setEnteredDocName] = useState("");

    useEffect(() => {
        (async () => {
            setEditorContent(currentDoc);
        })();
    }, [currentDoc]);

    async function choosenDoc(e) {
        const id = e.target.value.trim().toString();
        if (id !== "-99") {
            await setCurrentDoc(docs[id]);
        } else {
            setCurrentDoc({_id: null, name:"", text:""});
        }
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

        await fetchDoc();
        setEditorContent(newObject);
    };

    function createDoc() {
        setEditorContent({"_id": "", "name": "", "text": ""});
        const docName = prompt('Dokumentets namn: ');
        setEnteredDocName(docName);
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
                    onChange={event => handleChange(event, currentDoc._id)} 
                /> 
            </div>
        </div>
    )
}
export default Editor;
