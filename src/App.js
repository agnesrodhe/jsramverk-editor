import './App.css';
import { io } from "socket.io-client";
import React, { useEffect, useState } from 'react';

import docsModel from './models/docs';
import authModel from './models/auth';

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

function setTextToDocs(allDocs, socket) {
    const allDocsText = [];
    if (socket) {
        allDocs.forEach(document => {
            const docObj = {"_id": document._id, "text": document.text}
            allDocsText.push(docObj);
            socket.emit("create", allDocs[document._id]);
        });
    }
    return allDocsText;
}

function App() {
    const [socket, setSocket] = useState(null);
    const [docs, setDocs] = useState([]);
    const [docsText, setDocsText] = useState([]);
    const [message, setMessage] = useState('');
    const [currentDoc, setCurrentDoc] = useState({});
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [users, setUsers] = useState({});

    let SERVER_URL = window.location.href.includes("localhost") ?
    "http://localhost:8976" :
    "https://jsramverk-editor-agro21.azurewebsites.net";

    async function fetchDoc() {
        const allDocs = await docsModel.getAllDocs(token);
        const accessedDocs = setAccessedDocs(allDocs, user);
        const allDocsText = setTextToDocs(accessedDocs, socket);
        setDocsText(allDocsText);
        setDocs(accessedDocs);
    }

    async function fetchUsers() {
        const allUsers = await authModel.getAllUsers();
        console.log("fetchUsers", allUsers, "!");
        setUsers(allUsers);
    }

    useEffect(() => {
        (async () => {
            await fetchDoc();
            await fetchUsers();
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
                <Editor docs={docs} setDocs={setDocs} setEditorContent={setEditorContent} handleChange={handleChange} message={message} fetchDoc={fetchDoc} currentDoc={currentDoc} setCurrentDoc={setCurrentDoc} user={user} users={users} setToken={setToken} token={token} />
                :
                <Login setToken={setToken} token={token} setUser={setUser} user={user} />
                }
            
            </main>
        </div>
    );
}

export default App;
