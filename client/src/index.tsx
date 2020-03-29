import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './components/app/App';
import { reducer } from './store/reducers';
import websocketMiddleware from './store/middleware/websocket-middleware';
import { createStore, applyMiddleware, compose } from 'redux';
import initReactFastclick from 'react-fastclick';
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga';
import 'typeface-rubik';
import 'normalize.css';

initReactFastclick();

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(websocketMiddleware))
);

ReactGA.initialize('UA-71680879-6');

ReactDOM.render(
  <HelmetProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </HelmetProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
