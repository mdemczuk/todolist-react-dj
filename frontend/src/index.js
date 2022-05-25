import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Employee from "./routes/Employee";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/employee/:employeeId" element={<Employee />} />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
