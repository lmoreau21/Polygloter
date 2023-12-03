import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DailyChallenge from "./pages/DailyChallenge";
import EndlessMode from "./pages/EndlessMode";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/daily-challenge" element={<DailyChallenge />} />
      <Route path="/endless-mode" element={<EndlessMode />} />
    </Routes>
  );
}

export default App;