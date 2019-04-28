import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

function App() {
  const [message] = useState('hello, world');

  return <h1>{message}</h1>;
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
