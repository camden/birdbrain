import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { Route, RouteProps } from 'react-router-dom';

export enum AnalyticsCategory {
  ROOM = 'ROOM',
  GAME_FISHBOWL = 'GAME_FISHBOWL',
}

export const TrackedRoute: React.FC<RouteProps> = props => {
  useEffect(() => {
    if (!props.location) {
      return;
    }

    const page = props.location.pathname;
    ReactGA.set({ page });
    ReactGA.pageview(page);
  }, [props.location]);

  return <Route {...props} />;
};
