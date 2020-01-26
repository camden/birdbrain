import React from 'react';
import birdbrainLogo from '../../assets/images/birdbrain-logo.svg';
import './Home.css';
import io from 'socket.io-client';

const joinRoom = () => {
  const socket = io();
};

const Home: React.FC = () => {
  return (
    <div className="home">
      <header className="home__header">
        <img src={birdbrainLogo} className="birdbrain-logo" alt="logo" />
      </header>
      <section className="home__body">
        <section className="home__input-section">
          <input
            type="text"
            placeholder="Room Code"
            className="home__join-room-input"
          />
          <input
            type="text"
            placeholder="Name"
            className="home__join-room-input"
          />
          <button onClick={joinRoom} className="button home__button">
            Join Room
          </button>
        </section>
        <div className="home__input-section-divider">OR</div>
        <section className="home__input-section">
          <button onClick={joinRoom} className="button home__button">
            Create Room
          </button>
        </section>
      </section>
    </div>
  );
};

export default Home;
