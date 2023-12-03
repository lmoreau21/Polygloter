import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DailyChallenge from "./pages/DailyChallenge";
import EndlessMode from "./pages/EndlessMode";

function App() {
  return (
    <Routes>
      <Route path="/Polygloter" element={<Home />} />
      <Route path="/Polygloter/daily-challenge" element={<DailyChallenge />} />
      <Route path="/Polygloter/endless-mode" element={<EndlessMode />} />
      <Route path="*" element={<Home />} /> {/* Fallback for 404 */}
    </Routes>
  );
}

export default App;