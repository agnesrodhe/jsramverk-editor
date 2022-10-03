import './App.css';
import { io } from "socket.io-client";
import React, { useEffect, useState } from 'react';

import docsModel from './models/docs';

import Editor from './components/Editor';
import Login from './components/Login';

let sendToSocket = true;

function App() {
    const [socket, setSocket] = useState(null);
    const [docs, setDocs] = useState([]);
    const [docsText, setDocsText] = useState([]);
    const [message, setMessage] = useState('');
    const [currentDoc, setCurrentDoc] = useState({});
    const [token, setToken] = useState("");

    let SERVER_URL = "https://jsramverk-editor-agro21.azureWebsites.net";

    async function fetchDoc() {
        console.log(token);
        const allDocs = await docsModel.getAllDocs(token);
        const allDocsText = [];
        if (socket) {
            allDocs.forEach(document => {
                const docObj = {"_id": document._id, "text": document.text}
                allDocsText.push(docObj);
                socket.emit("create", allDocs[document._id]);
            });
        }
        setDocsText(allDocsText);
        setDocs(allDocs);
    }

    useEffect(() => {
        (async () => {
            await fetchDoc();
        })();
    }, [token]);

    function handleChange(event, id) {
        const tmpObject = {
            "_id": id,
            "text": event
        };

        setDocsText({...docsText, ...tmpObject})
        setMessage(event);
    }


    function setEditorContent(content) {
        let element = document.querySelector("trix-editor");
        element.value = "";
        element.editor.setSelectedRange([0, 0]);
        element.editor.insertHTML(content.text);
    }
    
    useEffect(() => {
        if (socket && sendToSocket) {
            socket.emit("doc", docsText);
        }

        sendToSocket = true;
    }, [docsText]);

    useEffect(() => {
        setSocket(io(SERVER_URL));

        return () => {
            if (socket) {
                socket.disconnect();
            }
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("doc", (data) => {
                //console.log(data);
                setEditorContent(data);
                sendToSocket = false;

            });
        }
    }, [socket]);

    return (
        <div className="App">
            <header className="App-header">
            <h2>TextEditor</h2>
            </header>
            <main>
                {token ?
                <Editor docs={docs} setEditorContent={setEditorContent} handleChange={handleChange} message={message} fetchDoc={fetchDoc} currentDoc={currentDoc} setCurrentDoc={setCurrentDoc} />
                :
                <Login setToken={setToken} token={token} />
                }
            
            </main>
        </div>
    );
}

export default App;
