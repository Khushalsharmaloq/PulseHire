import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import AppProviders from "./app/providers/AppProviders";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/auth.css";
import "./styles/register.css";
import "./styles/shell.css";
import "./styles/candidate-dashboard.css";
import "./styles/candidate-profile.css";
import "./styles/skill-proof.css";
import "./styles/skill-gap.css";
import "./styles/learning.css";
import "./styles/jobs.css";
import "./styles/job-details.css";
import "./styles/applications.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
);
