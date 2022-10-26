import Modal from 'react-modal';
import React, { useState } from 'react';
import "trix";
import "trix/dist/trix.css";
import docsModel from '../models/docs';
import { useEffect } from "react";
import TextEditor from "./TextEditor";
import CodeEditor from "./CodeEditor";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#f1d2d4',
        width: '50%',
        },
    };

    Modal.setAppElement('#root');

function Editor({docs, setEditorContent, handleChange, message, fetchDoc, currentDoc, setCurrentDoc, user, setToken, setCodeMode, codeMode, editorRef, handleEditorDidMount}) {
    const [enteredDocName, setEnteredDocName] = useState("");
    const [enteredTextType, setEnteredTextType] = useState("");
    const [owner, setOwner] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [docName, setDocName] = useState("");

    useEffect(() => {
        (async () => {
            setEditorContent(currentDoc, false);
        })();
    }, [currentDoc]);

    function choosenDoc(e) {
        const id = e.target.value.trim().toString();
        if (id !== "-99") {
            if (docs[id].textType === "code") {
                setCodeMode(true);
            } else {
                setCodeMode(false);
            };
            setCurrentDoc(docs[id]);
            setOwner(docs[id].owner);
        } else {
            setCurrentDoc({_id: null, name:"", text:""});
            setOwner("");
        };
    };

    async function saveDoc() {
        let newObject = {};
        if (enteredDocName !== "") {
            newObject = {
                "name": enteredDocName,
                "text": message,
                "textType": enteredTextType,
                "owner": owner,
                "allowed_users": []
            };
            await docsModel.createDoc(newObject);
            setEnteredDocName("");
        } else {
            newObject = {
                "name": currentDoc.name,
                "text": message,
                "_id": currentDoc._id,
                "textType": currentDoc.textType,
                "owner": currentDoc.owner,
                "allowed_users": currentDoc.allowed_users
            };
            await docsModel.updateDoc(newObject);
        }
        await fetchDoc();
        setEditorContent(newObject);
        console.log("in savedoc");
    };

    function createDoc() {
        setIsOpen(true);
        if (codeMode === true) {
            setEnteredTextType("code");
        } else if (codeMode === false) {
            setEnteredTextType("text");
        };
        setOwner(user.email);
    };

    function logOut() {
        setToken("");
    }

    function handleEditorMode(e) {
        if (e.target.checked) {
            setCodeMode(false);
        } else {
            setCodeMode(true);
        }
    }

    function closeModal() {
        setIsOpen(false);
    }

    function saveCreated() {
        setIsOpen(false);
        setEnteredDocName(docName);
        setEditorContent({"_id": "", "name": "", "text": ""});
    }

    function handleNameChange(event) {
        setDocName(event.target.value);
    }

    return (
        <div className="toggleDiv">
            {codeMode ?
            <div className="toggle code-toggle">
                <label className="switch">
                <input className="input" onClick={handleEditorMode} type="checkbox" value="code" defaultChecked ></input>
                    <span className="slider"></span>
                </label>
                <p>Switch mode</p>
            </div>
            :
            <div className="toggle">
                <label className="switch">
                <input className="input" onClick={handleEditorMode} type="checkbox" value="code" defaultChecked ></input>
                    <span className="slider"></span>
                </label>
            <p>Switch mode</p>
        </div>
            }
            <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            >
            <div className="closeDiv">
                <button className="closeBtn" onClick={closeModal}>X</button>
            </div>
            <h2 className='modalTitle'>Nytt dokument</h2>
            <form className="modalForm codeModal">
                <label>Namn</label>
                <input type="text" name="name" onChange={handleNameChange}></input>
                <input type="submit" onClick={saveCreated} value="Skapa"></input>
            </form>
            </Modal>
            { codeMode ?
            <CodeEditor docs={docs} setEditorContent={setEditorContent} handleChange={handleChange} currentDoc={currentDoc} user={user} logOut={logOut} createDoc={createDoc} saveDoc={saveDoc} choosenDoc={choosenDoc} owner={owner} editorRef={editorRef} handleEditorDidMount={handleEditorDidMount} />
            :
            <TextEditor docs={docs} setEditorContent={setEditorContent} handleChange={handleChange} currentDoc={currentDoc} user={user} logOut={logOut} createDoc={createDoc} saveDoc={saveDoc} choosenDoc={choosenDoc} owner={owner} />
            }
        </div>
    )
}
export default Editor;
