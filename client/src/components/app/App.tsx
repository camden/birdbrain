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
import PingPong from 'components/games/ping-pong/PingPong';
import ClapScore from 'components/games/clapscore/ClapScore';
import QueryString from 'query-string';
import cx from 'classnames';

const App: React.FC = () => {
  const query = QueryString.parse(window.location.search);
  const hasDesktopQuery = query && !!query.desktop;

  return (
    <Div100vh className={styles.app}>
      <Meta />
      <div
        className={cx(styles.app_inner, { [styles.desktop]: hasDesktopQuery })}
      >
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
            <TrackedRoute path="/pingpong">
              <PingPong />
            </TrackedRoute>
            <TrackedRoute path="/clapscore">
              {process.env.NODE_ENV === 'development' && <ClapScore />}
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
