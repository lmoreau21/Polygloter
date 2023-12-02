import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom-styles.css'; 


const Home = () => {
  const [isInstructionsModalPopupOpen, setInstructionsModalPopupOpen] = useState(false);
  const [isSettingsModalPopupOpen, setSettingsModalPopupOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'false' ? false : true);
  const [hintsEnabled, setHintsEnabled] = useState(localStorage.getItem('hintsEnabled') === 'false' ? false : true);
  
  const navigate = useNavigate();

  const onButtonClickDC = useCallback(() => {
    navigate("/daily-challenge");
  }, [navigate]);

  const onButtonClickEM = useCallback(() => {
    navigate("/endless-mode");
  }, [navigate]);

  const onInstClick = () => setInstructionsModalPopupOpen(!isInstructionsModalPopupOpen);
  const onSetClick = () => setSettingsModalPopupOpen(!isSettingsModalPopupOpen);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const toggleHints = () => {
    const newHintsEnabled = !hintsEnabled;
    setHintsEnabled(newHintsEnabled);
    localStorage.setItem('hintsEnabled', newHintsEnabled);
  };

  return (
    <div className="home dark-mode" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap:20 }}>
       <div className="content text-center">
        <h1>Polygloter</h1>
        <h3>Language Guessing Game</h3>
      </div>
      <div style={{ display: 'flex', width: 350, flexDirection:'column', gap:20}}>
      <Button variant="primary" onClick={onButtonClickDC}>
        Daily Challenge
      </Button>
      <Button variant="primary" onClick={onButtonClickEM}>
        Endless Mode
      </Button>
  
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <Button variant="primary" style={{ flex: 1 }} onClick={onInstClick}>
          ?
        </Button>
        <Button variant="primary" style={{ flex: 1}} onClick={onSetClick}>
          Settings
        </Button>
    
  
      </div></div>

        {/* Instructions Modal */}
        <Modal show={isInstructionsModalPopupOpen} onHide={onInstClick} centered size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Welcome to Polygloter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Test your linguistic skills and become a language detective!</p>
            <h3>Daily Challenge:</h3>
            <ul>
           <li>
            Each day, you’re presented with a unique word in a mystery language.
          </li>
          <li>
            Your mission: identify the language of origin from a dropdown list
            of options.
          </li>
          <li>
            You have 6 attempts to guess correctly.
          </li>
          <li>
            Make a wrong guess? Don’t worry! You'll receive a hint to nudge you
            closer to the answer.
          </li>
          <li>
            Hints may include geographic region, language family, or a famous
            person who speaks the language.
          </li>
        </ul>
        <h3>Endless Mode:</h3>
        <ul>
          <li>
            Challenge yourself with an unlimited stream of phrases.
          </li>
          <li>
            After each correct guess, a new phrase in a different language will
            appear.
          </li>
          <li>
            Just like in Daily Challenge, you get 6 guesses per phrase.
          </li>
          <li>
            The hints system operates in the same way, helping you when you're
            stuck.
          </li>
          <li>
            See how many languages you can identify in a row and set a new
            personal record!
          </li>
        </ul>
        <p>
          Enjoy your linguistic adventure in Polygloter, where every word is a
          world to explore!
      </p>
      </Modal.Body>
    </Modal>


    {/* Settings Modal */}
    <Modal show={isSettingsModalPopupOpen} onHide={onSetClick} centered>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Check 
        type="switch"
        id="dark-mode-switch"
        label="Dark Mode"
        checked={darkMode}
        onChange={toggleDarkMode}
      />
      <Form.Check 
        type="switch"
        id="hints-switch"
        label="Hints"
        checked={hintsEnabled}
        onChange={toggleHints}
      />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSetClick}>Close</Button>
      </Modal.Footer>
    </Modal>
</div>
);
};

export default Home;
