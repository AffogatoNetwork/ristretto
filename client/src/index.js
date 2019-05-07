import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Drizzle, generateStore } from "drizzle";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { theme, ThemeProvider } from "rimble-ui";

import Debt from "./contracts/Debt.json";

const options = {
  contracts: [Debt]
};
const myTheme = {
  ...theme,
  colors: {
    primary: "#332211",
    black: "#3f3d4b",
    white: "#fff",
    blue: "#007ce0",
    navy: "#004175",
    secondary: "#cc7722"
  }
};
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
  <ThemeProvider theme={myTheme}>
    <Router>
      <App drizzle={drizzle} />
    </Router>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
