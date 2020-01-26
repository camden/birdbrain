import React from 'react';
import Home from '../home/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Room from '../room/Room';

const App: React.FC = () => {
  return (
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
  );
};

export default App;
