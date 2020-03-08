import React from 'react';
import Home from '../home/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Room from '../room/Room';
import styles from './App.module.css';
import Div100vh from 'react-div-100vh';
import Demo from 'components/demo/Demo';
import CreateRoom from 'components/home/CreateRoom';
import Meta from 'components/shared/meta/Meta';

const App: React.FC = () => {
  return (
    <Div100vh className={styles.app}>
      <Meta />
      <div className={styles.app_inner}>
        <Router>
          <Switch>
            <Route path="/create-room">
              <CreateRoom />
            </Route>
            <Route path="/demo">
              <Demo />
            </Route>
            <Route path="/room/:id">
              <Room />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </div>
    </Div100vh>
  );
};

export default App;
