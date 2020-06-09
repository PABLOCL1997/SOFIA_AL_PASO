import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from "react-apollo";
import './i18n';
import createClient from './apollo';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createClient().then(client => {
    ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));
    serviceWorker.unregister();
});