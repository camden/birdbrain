import React from 'react';
import Home from '../home/Home';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Room from '../room/Room';
import styles from './App.module.css';
import Div100vh from 'react-div-100vh';
import Demo from 'components/demo/Demo';
import CreateRoom from 'components/home/CreateRoom';
import Meta from 'components/shared/meta/Meta';
import { TrackedRoute } from 'analytics';

const App: React.FC = () => {
  return (
    <Div100vh className={styles.app}>
      <Meta />
      <div className={styles.app_inner}>
        <Router>
          <Switch>
            <TrackedRoute path="/create-room">
              <CreateRoom />
            </TrackedRoute>
            <TrackedRoute path="/demo">
              <Demo />
            </TrackedRoute>
            <TrackedRoute path="/room/:id">
              <Room />
            </TrackedRoute>
            <TrackedRoute path="/">
              <Home />
            </TrackedRoute>
          </Switch>
        </Router>
      </div>
    </Div100vh>
  );
};

export default App;
