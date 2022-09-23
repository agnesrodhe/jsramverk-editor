import React, { useEffect, useState } from 'react';
import './App.css';
import Editor from './components/Editor';
import docsModel from './models/docs';
import { io } from "socket.io-client";

let sendToSocket = true;

function App() {
    const [socket, setSocket] = useState(null);
    const [docs, setDocs] = useState([]);
    const [docsText, setDocsText] = useState([]);
    const [message, setMessage] = useState('');
    const [currentDoc, setCurrentDoc] = useState({});

    let SERVER_URL = "http://localhost:8976";

    async function fetchDoc() {
        const allDocs = await docsModel.getAllDocs();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            <Editor docs={docs} setEditorContent={setEditorContent} handleChange={handleChange} message={message} fetchDoc={fetchDoc} currentDoc={currentDoc} setCurrentDoc={setCurrentDoc} />
            </main>
        </div>
    );
}

export default App;
