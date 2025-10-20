import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Handle client-side routing for GitHub Pages
if (window.location.pathname !== '/' && window.location.pathname !== '/taskflow/') {
  window.history.replaceState(null, '', '/taskflow' + window.location.pathname);
}

createRoot(document.getElementById("root")!).render(<App />);
