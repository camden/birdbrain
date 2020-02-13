import React from 'react';
import Home from '../home/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Room from '../room/Room';
import styles from './App.module.css';
import Div100vh from 'react-div-100vh';

const App: React.FC = () => {
  return (
    <Div100vh className={styles.app}>
      <div className={styles.app_inner}>
        <Router>
          <Switch>
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
