import './App.css';
import { io } from "socket.io-client";
import React, { useEffect, useState, useRef } from 'react';

import docsModel from './models/docs';

import Editor from './components/Editor';
import Login from './components/Login';

let sendToSocket = true;

function setAccessedDocs(allDocs, user) {
    const allAccessedDocs = [];
        allDocs.forEach(document => {
            if (document.owner.includes(user.email)) {
                allAccessedDocs.push(document);
            } else if (document.allowed_users.includes(user.email)) {
                    allAccessedDocs.push(document);
                }
        });
    return allAccessedDocs;
}

function setTextTypeDocs(accessedDocs, codeMode) {
    const docsCodeType = [];
    const docsTextType = [];
    let docsRightType = [];
    accessedDocs.forEach(document => {
        if (document.textType.includes("code")) {
            docsCodeType.push(document);
        } else if (document.textType.includes("text")) {
            docsTextType.push(document);
        };
    });
    if (codeMode) {
        docsRightType = docsCodeType;
    } else {
        docsRightType = docsTextType;
    };
    return docsRightType;
}

function App() {
    const [socket, setSocket] = useState(null);
    const [docs, setDocs] = useState([]);
    const [docsText, setDocsText] = useState([]);
    const [message, setMessage] = useState('');
    const [currentDoc, setCurrentDoc] = useState({});
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [codeMode, setCodeMode] = useState(false);
    const editorRef = useRef(null);

    let SERVER_URL = window.location.href.includes("localhost") ?
    "http://localhost:8976" :
    "https://jsramverk-editor-agro21.azurewebsites.net";

    async function fetchDoc() {
        const allDocs = await docsModel.getAllDocs(token);
        const accessedDocs = setAccessedDocs(allDocs, user);
        let docsRightType = setTextTypeDocs(accessedDocs, codeMode);
        setDocs(docsRightType);
    }

    useEffect(() => {
        (async () => {
            await fetchDoc();
        })();
    }, [token]);

    useEffect(() => {
        (async () => {
            await fetchDoc();
        })();
    }, [codeMode]);

    function handleChange(event, id) {
        const tmpObject = {
            "_id": id,
            "text": event
        };

        setDocsText(tmpObject);
        setMessage(event);
    }

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor; 
    }

    function setEditorContent(content, triggerChange=true) {
        if (codeMode) {
            sendToSocket = triggerChange;
            editorRef.current.setValue("");
            sendToSocket = triggerChange;
            editorRef.current.setValue(content.text);
        } else {
            let element = document.querySelector("trix-editor");
            sendToSocket = triggerChange;
            element.value = "";
            element.editor.setSelectedRange([0, 0]);
            sendToSocket = triggerChange;
            element.editor.insertHTML(content.text);
        }
    }

    useEffect(() => {
        // console.log("sendtosocket", sendToSocket)
        // console.log(docsText)
        if (socket && sendToSocket) {
            if (docsText._id != null) {
                socket.emit("doc", docsText);
            }
            socket.on("document", (data) => {
                if (currentDoc._id === data._id) {
                    setEditorContent(data);
                }
            sendToSocket = false;
        });
        }
        sendToSocket = true;
    }, [docsText]);

    useEffect(() => {
        if (socket) {
            socket.emit("create", currentDoc._id);
        }
    }, [currentDoc]);

    useEffect(() => {
        setSocket(io(SERVER_URL));

        return () => {
            if (socket) {
                socket.disconnect();
            }
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="App" id="root">
            {codeMode ?
            <header className="App-header code-header">
            <h2>CodeEditor</h2>
            </header>
            :
            <header className="App-header">
            <h2>TextEditor</h2>
            </header>
            }
            <main>
                {token ?
                <Editor docs={docs} setDocs={setDocs} setEditorContent={setEditorContent} handleChange={handleChange} message={message} fetchDoc={fetchDoc} currentDoc={currentDoc} setCurrentDoc={setCurrentDoc} user={user} setToken={setToken} token={token} setCodeMode={setCodeMode} codeMode={codeMode} editorRef={editorRef} handleEditorDidMount={handleEditorDidMount} />
                :
                <Login setToken={setToken} setUser={setUser} user={user} />
                }
            </main>
        </div>
    );
}

export default App;
