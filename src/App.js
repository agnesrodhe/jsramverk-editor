import React from 'react';
import { useState } from 'react';
import "trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  function save() {
    console.log(message);
  };

  function handleChange(event) {
    setMessage(event);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h2>TextEditor</h2>
      </header>
      <nav className="App-navbar">
          <button className="saveBtn" onClick={save}>Spara</button>
      </nav>
      <div className="trixDiv">
          <TrixEditor 
            className='trix' 
            name="message" 
            onChange={handleChange}
          />
      </div>
    </div>
  );
}

export default App;
