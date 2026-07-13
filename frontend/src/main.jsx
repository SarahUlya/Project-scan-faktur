import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import appTheme from "./theme/appTheme";
import "./index.css";
import "./styles/faktur-print.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={appTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
