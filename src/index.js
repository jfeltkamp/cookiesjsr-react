import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import reducer from './store/reducer.js';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const store = (process.env.NODE_ENV === 'development')
  ? createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  : createStore(reducer);

const container = document.getElementById('cookiesjsr');
const root = createRoot(container);
root.render(<React.StrictMode>
                <Provider store={store}>
                    <App />
                </Provider>
            </React.StrictMode>);

