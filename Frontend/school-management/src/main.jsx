import { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import GetSchool from "./getSchool.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  //   <App />
  //   <GetSchool />
  // </StrictMode>
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/addSchool" replace />} />
        <Route path="/addSchool" element={<App />} />
        <Route path="/listSchools" element={<GetSchool />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
