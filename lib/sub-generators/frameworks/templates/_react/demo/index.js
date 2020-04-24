import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '#/common/style.css';

function App() {
  const [message] = useState('hello, world');

  return (
    <div className="container mx-auto px-4">
      <div className="bg-blue-200 p-4">
        <div className="bg-blue-400 p-4">{message}</div>
      </div>
    </div>
  );
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
