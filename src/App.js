import React from "react";
import { Route, HashRouter, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DailyChallenge from "./pages/DailyChallenge";
import EndlessMode from "./pages/EndlessMode";
import './global.css';
function App() {
  const basename = process.env.NODE_ENV === "production" ? "/Polygloter" : "/Polygloter";

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily-challenge" element={<DailyChallenge />} />
        <Route path="/endless-mode" element={<EndlessMode />} />
        <Route path="/*" element={<Home />} /> {/* Fallback for 404 */}
      </Routes>
    </HashRouter>
  );
}

export default App;