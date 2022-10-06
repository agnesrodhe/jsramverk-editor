import React from "react";
import { useState } from "react";
import docsModel from '../models/docs';

function Allow({users, currentDoc, logOut}) {
    const [choosenUser, setChoosenUser] = useState("");

    async function choosenUserToAllow(e) {
        const id = e.target.value.trim().toString();
        if (id !== "-99") {
            setChoosenUser(users[id]);
        };
    };

    async function addUsers() {
        console.log(currentDoc.allowed_users);
        let newObject = {};
        if (currentDoc.allowed_users == null) {
            console.log("här");
            newObject = {
                "name": currentDoc.name,
                "text": currentDoc.text,
                "_id": currentDoc._id,
                "owner": currentDoc.owner,
                "allowed_users": [
                    choosenUser.email
                ]
            };
        } else {
            currentDoc.allowed_users.push(choosenUser.email)
            newObject = {
                "name": currentDoc.name,
                "text": currentDoc.text,
                "_id": currentDoc._id,
                "owner": currentDoc.owner,
                "allowed_users": currentDoc.allowed_users
            };
        };
        await docsModel.updateDoc(newObject);
        alert(`${choosenUser.email} kan nu redigera dokumentet!`);
    };

    return (
        <div className="userButtons">
            <select data-testid="dropdown" className="userBtn" onChange={choosenUserToAllow}>
                <option value="-99" key="0">Välj en användare</option>
                {users.map((user, index) => <option data-testid="select" value={index} key={index}>{user.email}</option>)}
            </select>
            <button className="userBtn" onClick={addUsers}>Ge användare åtkomst</button>
            <button className="submit" onClick={logOut}>Logga ut</button>
        </div>

    )
}
export default Allow;