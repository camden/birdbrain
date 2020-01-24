import React from 'react';
import birdbrainLogo from './birdbrain-logo.svg';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={birdbrainLogo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
};

export default App;
