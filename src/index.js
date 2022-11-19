import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import reducer from './store/reducer.js';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const store = (process.env.NODE_ENV === 'development')
  ? createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  : createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('cookiesjsr')
);

