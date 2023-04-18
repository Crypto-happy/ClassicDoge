import React from "react";
import ReactDOM from "react-dom";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import { Provider } from "react-redux";

import App from "./App";
import LoadingProvider from "./components/LoadingProvider";
import MetamaskProvider from "./components/MetamaskProvider";
import store from "./store";
import "./index.scss";

function getLibrary(provider) {
  return new Web3(provider);
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <LoadingProvider>
          <MetamaskProvider>
            <App />
          </MetamaskProvider>
        </LoadingProvider>
      </Provider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
