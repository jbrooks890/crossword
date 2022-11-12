import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import AuthContextProvider from "./components/contexts/AuthContextProvider";

ReactDOM.render(
  <Router>
    <React.StrictMode>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </React.StrictMode>
  </Router>,
  document.getElementById("root")
);
