import React from 'react';
import birdbrainLogo from './birdbrain-logo.svg';
import './App.css';
import io from 'socket.io-client';

const connect = () => {
  const socket = io();
};

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={birdbrainLogo} className="App-logo" alt="logo" />
        <button onClick={connect}>Connect</button>
      </header>
    </div>
  );
};

export default App;
