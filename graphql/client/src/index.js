import React from 'react';
import {render} from 'react-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import App from './App'
import './assets/style.scss'
import {Provider} from 'react-redux'
import store from './store/config'

render(<Provider store={store}>
	<App />
	</Provider>,document.querySelector('#root'))