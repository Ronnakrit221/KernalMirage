// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetStarted from "./pages/GetStarted";
import UploadAudio from "./pages/UploadAudio";
import Result from "./pages/Result";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/upload" element={<UploadAudio />} />
        <Route path="/result" element={<Result />} />  {/*เพิ่ม Route นี้*/}
      </Routes>
    </Router>
  );
}

export default App;
 