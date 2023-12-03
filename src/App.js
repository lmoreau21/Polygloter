import React from "react";
import { Route, HashRouter } from "react-router-dom";
import Home from "./pages/Home";
import DailyChallenge from "./pages/DailyChallenge";
import EndlessMode from "./pages/EndlessMode";

function App() {
  return (
    <HashRouter basename="/Polygloter">
      <Route path="/" element={<Home />} />
      <Route path="/daily-challenge" element={<DailyChallenge />} />
      <Route path="/endless-mode" element={<EndlessMode />} />
      <Route path="*" element={<Home />} /> {/* Fallback for 404 */}
    </HashRouter>
  );
}

export default App;