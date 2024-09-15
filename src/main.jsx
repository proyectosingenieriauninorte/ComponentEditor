import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import "./styles/index.css";

// Get the root DOM element where your app will be mounted
const container = document.getElementById('root');

// Create a root and render your app
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);