import { TrixEditor } from "react-trix";
import React, { useState } from 'react';
import "trix";
import "trix/dist/trix.css";
import docsModel from '../models/docs';
import { useEffect } from "react";
import Save from './Save';
import Create from './Create';
import DropDown from "./DropDown";
import Allow from "./Allow";
import LoggedIn from "./LoggedIn";

function Editor({docs, setEditorContent, handleChange, message, fetchDoc, currentDoc, setCurrentDoc, user, setToken, token}) {
    const [enteredDocName, setEnteredDocName] = useState("");
    const [owner, setOwner] = useState("");

    useEffect(() => {
        (async () => {
            setEditorContent(currentDoc);
        })();
    }, [currentDoc]);

    async function choosenDoc(e) {
        const id = e.target.value.trim().toString();
        if (id !== "-99") {
            await setCurrentDoc(docs[id]);
            setOwner(docs[id].owner);
        } else {
            setCurrentDoc({_id: null, name:"", text:""});
            setOwner("");
        }
    }

    async function saveDoc() {
        let newObject = {};
        if (enteredDocName !== "") {
            newObject = {
                "name": enteredDocName,
                "text": message,
                "owner": owner,
                "allowed_users": []
            };
            await docsModel.createDoc(newObject);
        } else {
            newObject = {
                "name": currentDoc.name,
                "text": message,
                "_id": currentDoc._id,
                "owner": currentDoc.owner,
                "allowed_users": currentDoc.allowed_users
            };
            await docsModel.updateDoc(newObject);
        }

        await fetchDoc();
        setEditorContent(newObject);
    };

    function createDoc() {
        setEditorContent({"_id": "", "name": "", "text": ""});
        const docName = prompt('Dokumentets namn: ');
        setOwner(user.email);
        setEnteredDocName(docName);
    };

    function logOut() {
        console.log(token);
        setToken("");
        console.log(token);
    }

    return (
        <div>
            {(owner == user.email) ?
            <nav className="App-navbar">
                <div>
                <Save onClick={saveDoc} />
                <Create onClick={createDoc} />
                <DropDown onChange={choosenDoc} docs={docs} />
                </div>
                <Allow currentDoc={currentDoc} />
            </nav>
            :
            <nav className="App-navbar">
                <div>
                <Save onClick={saveDoc} />
                <Create onClick={createDoc} />
                <DropDown onChange={choosenDoc} docs={docs} />
                </div>
            </nav>
            }
            <LoggedIn logOut={logOut} user={user} />
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
