import React from 'react';
import Home from '../home/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Room from '../room/Room';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <div className={styles.app}>
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
    </div>
  );
};

export default App;
