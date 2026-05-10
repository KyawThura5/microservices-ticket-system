import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/app.css";
import App from "./App.jsx";
import { logEnvConfig } from "./config/env";

logEnvConfig();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
