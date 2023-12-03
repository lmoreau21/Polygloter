import { HashRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import DailyChallenge from "./pages/DailyChallenge";
import EndlessMode from "./pages/EndlessMode";

function App() {
  return (
    <Router basename="/Polygloter">
      <Route exact path="/" component={Home} />
      <Route path="/daily-challenge" component={DailyChallenge} />
      <Route path="/endless-mode" component={EndlessMode} />
      <Route path="/*" component={Home} /> {/* Fallback for 404 */}
    </Router>
  );
}

export default App;