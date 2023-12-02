import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DailyChallenge from "./pages/DailyChallenge";
import EndlessMode from "./pages/EndlessMode";
//import NotFound from "./pages/NotFound"; // 404 page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/daily-challenge" element={<DailyChallenge />} />
      <Route path="/endless-mode" element={<EndlessMode />} />
      <Route path="*" element={<Home />} /> {/* Fallback for 404 */}
    </Routes>
  );
}

export default App;
