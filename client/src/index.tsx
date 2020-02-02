import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './components/app/App';
import { reducer } from './store/reducers';
import websocketMiddleware from './store/middleware/websocket-middleware';
import { createStore, applyMiddleware } from 'redux';

const store = createStore(reducer, applyMiddleware(websocketMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
