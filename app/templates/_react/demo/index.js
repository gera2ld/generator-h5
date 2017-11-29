import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  state = {
    message: 'hello, world',
  };

  render() {
    return <h1>{this.state.message}</h1>;
  }
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
