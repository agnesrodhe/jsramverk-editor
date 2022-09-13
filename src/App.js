import React from 'react';
import './App.css';
import Editor from './components/Editor';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h2>TextEditor</h2>
      </header>
      <main>
        <Editor />
      </main>
    </div>
  );
}

export default App;
