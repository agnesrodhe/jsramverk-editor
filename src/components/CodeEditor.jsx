import Modal from 'react-modal';
import React, { useState } from 'react';
import Save from './navbar/Save';
import Create from './navbar/Create';
import DropDown from "./navbar/DropDown";
import Allow from "./navbar/Allow";
import LoggedIn from "./LoggedIn";
import Editor from "@monaco-editor/react";
import codeModel from '../models/code';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#0a0909',
        fontFamily: 'Courier New',
        color: '#02f948',
        width: '50%',
        height: '50%',
        },
    };

Modal.setAppElement('#root');

function CodeEditor({docs, handleChange, currentDoc, user, saveDoc, createDoc, choosenDoc, logOut, owner, editorRef, handleEditorDidMount}) {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [outPut, setOutPut] = useState("");

    async function runCode() {
        const outPut = await codeModel.runCode(editorRef.current.getValue());
        setIsOpen(true);
        setOutPut(outPut);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div>
            {(owner === user.email) ?
            <nav className="App-navbar">
                <div>
                <Save onClick={saveDoc} />
                <Create onClick={createDoc} />
                <DropDown onChange={choosenDoc} docs={docs} />
                </div>
                <div>
                <Allow currentDoc={currentDoc} user={user} />
                </div>
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
            <div className="code-editor">
                <button onClick={runCode}>Run code</button>
                <Editor
                height="90vh"
                width="80%"
                margin="10px"
                defaultLanguage="javascript"
                onMount={handleEditorDidMount}
                className="codeEditor"
                onChange={event => handleChange(event, currentDoc._id)} 
                />
            <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            >
                <div className="closeDiv">
                    <button className="closeBtn" onClick={closeModal}>X</button>
                </div>
                <p>{outPut}</p>
            </Modal>
            </div>
        </div>
    )
}
export default CodeEditor;