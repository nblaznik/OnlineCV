import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/ibm-plex-sans";
import App from "./App.jsx";
import CvEditor from "./CvEditor.jsx";
import PrintCV from "./PrintCV.jsx";
import cv from "./data/cv_data.json";
import "./index.css";

const view = new URLSearchParams(window.location.search).get("view");
const content =
  view === "print" ? (
    <PrintCV data={cv} />
  ) : view === "editor" && import.meta.env.DEV ? (
    <CvEditor initialData={cv} />
  ) : (
    <App />
  );

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{content}</React.StrictMode>
);
