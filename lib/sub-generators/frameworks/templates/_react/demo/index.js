import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

class App extends React.Component {
  state = {
    message: 'hello, world',
  };

  render() {
    const { message } = this.state;
    return <h1>{message}</h1>;
  }
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
