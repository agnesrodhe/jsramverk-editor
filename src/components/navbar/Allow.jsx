import React from "react";
import { useState, useEffect } from "react";
import docsModel from '../../models/docs';
import SendEmail from "./SendEmail";

function Allow({ currentDoc, user}) {
    const [choosenUser, setChoosenUser] = useState("");
    const [listOfUserNames, setListOfUserNames] = useState([]);

    let base_url = window.location.href.includes("localhost") ?
    "http://localhost:8976" :
    "https://jsramverk-editor-agro21.azurewebsites.net";
    useEffect(() => {
        (async () => {
            let namesTmpList = [];
            const response = await fetch(`${base_url}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query: "{ users { email } }" })
            });
            const result = await response.json();
            for (let i = 0; i < result.data.users.length; i++) {
                namesTmpList.push(result.data.users[i].email);
            }
            setListOfUserNames(namesTmpList);
        })();
    }, [currentDoc]);

    async function choosenUserToAllow(e) {
        const id = e.target.value.trim().toString();
        if (id !== "-99") {
            setChoosenUser(listOfUserNames[id]);
        };
    };

    async function addUsers() {
        let newObject = {};
        if (currentDoc.allowed_users == null) {
            newObject = {
                "name": currentDoc.name,
                "text": currentDoc.text,
                "_id": currentDoc._id,
                "textType": currentDoc.textType,
                "owner": currentDoc.owner,
                "allowed_users": [
                    choosenUser
                ]
            };
        } else {
            currentDoc.allowed_users.push(choosenUser)
            newObject = {
                "name": currentDoc.name,
                "text": currentDoc.text,
                "_id": currentDoc._id,
                "textType": currentDoc.textType,
                "owner": currentDoc.owner,
                "allowed_users": currentDoc.allowed_users
            };
        };
        await docsModel.updateDoc(newObject);
        alert(`${choosenUser} kan nu redigera dokumentet!`);
    };

    return (
        <div className="userButtons">
            <div>
                <select data-testid="dropdown" className="userBtn" onChange={choosenUserToAllow}>
                    <option value="-99" key="0">V??lj en anv??ndare</option>
                    {listOfUserNames.map((user, index) => <option data-testid="select" value={index} key={index}>{user}</option>)}
                </select>
            </div>
            <div>
                <button className="userBtn" onClick={addUsers}>Ge anv??ndare ??tkomst</button>
            </div>
            <SendEmail user={user} addUsers={addUsers} currentDoc={currentDoc} setChoosenUser={setChoosenUser} />
        </div>

    )
}
export default Allow;