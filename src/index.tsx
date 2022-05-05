import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "react-apollo";
import "./i18n";
import createClient from "./apollo";
import "react-datepicker/dist/react-datepicker.css";
import { store } from "./state/store";
import { Provider } from 'react-redux';

createClient().then((client) => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>,
    document.getElementById("root")
  );
  serviceWorker.unregister();
});
