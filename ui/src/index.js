import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import configureStore from './redux/store'
import {Provider} from 'react-redux'
import * as serviceWorker from './serviceWorker';

import { ToastContainer } from 'react-toastify';

ReactDOM.render(
    <Provider store = {
        configureStore()
    } >
        <div>
            <App />
            <ToastContainer />
        </div>
    </Provider>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
