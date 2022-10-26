import { TrixEditor } from "react-trix";
import React from 'react';
import "trix";
import "trix/dist/trix.css";
import Save from './navbar/Save';
import Create from './navbar/Create';
import DropDown from "./navbar/DropDown";
import Allow from "./navbar/Allow";
import LoggedIn from "./LoggedIn";
import GeneratePdf from "./navbar/GeneratePdf";

function TextEditor({docs, setEditorContent, handleChange, currentDoc, user, owner, saveDoc, createDoc, choosenDoc, logOut}) {

    return (
        <div>
            {(owner === user.email) ?
            <nav className="App-navbar">
                <div>
                <Save onClick={saveDoc} />
                <Create onClick={createDoc} />
                <DropDown onChange={choosenDoc} docs={docs} />
                <GeneratePdf currentDoc={currentDoc} />
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
                <GeneratePdf currentDoc={currentDoc} />
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
export default TextEditor;
