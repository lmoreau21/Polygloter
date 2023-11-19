import React, { useState, useEffect } from 'react';
import hints from '../hints.json';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom-styles.css';
import { ChevronLeft } from 'react-feather';


function EndlessMode() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [hints, setHints] = useState([]);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [lang_counter, setLangCounter] = useState(0);

  const phrases = 'How are you doing?';
  const correctLanguage = ['French','Chinese']; 
  const placeholder_phrase = ['Comment allez-vous','你好吗'];
  const hintsForLanguages = hints; 
  const [guessedLanguages, setGuessedLanguages] = useState(new Set()); 
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (gameOver) {
      //setScore(score+1);
      alert(`Congratulations! You've guessed the correct language: ${correctLanguage[lang_counter]}`);
      setGameOver(true);
    } else if (round >= 5) {
      alert(`Failed! The correct language was: ${correctLanguage[lang_counter]}`);
      setGameOver(true); // End the game if the user has used all attempts
    }
  }, [gameOver, round, correctLanguage, lang_counter]);

  const handleSelectButtonClick = () => {
    if (!gameOver && selectedLanguage !== correctLanguage[lang_counter] && round < 5) {
      const newHint = round === 1
        ? `${selectedLanguage}, Phrase in English: ${phrases}`
        : `${selectedLanguage}, ${hintsForLanguages[correctLanguage[lang_counter]][`hint${round}`]}`;
      setHints([...hints, newHint]);
      setRound(round + 1);
      
    } else if (selectedLanguage === correctLanguage[lang_counter]) {
      setGameOver(true);
      setScore(score + 1);
    }
  };

  const handleStartOverClick = () => {
    setRound(1);
    setHints([]);
    setGameOver(false);
    setGuessedLanguages(new Set());
    setLangCounter((prevLangCounter) => (prevLangCounter + 1) % correctLanguage.length);
  };

  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
  }

  return (
    <div style={{ backgroundColor:'#262d4c', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column'}}>
    <Navbar expand="lg" variant="dark">
      <div className="col-md-4 d-flex align-items-center">
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <ChevronLeft />
          {/* Invisible spacer, same width as 'Endless Mode' */}
          <div style={{ visibility: 'hidden', fontSize: 16 }}>Endless Mode</div>
        </Navbar.Brand>
      </div>
      <div className="col-md-4 d-flex justify-content-center">
        <span className="navbar-text" style={{ color: "#fff", fontSize: 34 }}>
          Polygloter
        </span>
      </div>
      <div className="col-md-4 d-flex justify-content-end">
        <span className="navbar-text" style={{ color: "#fff", fontSize: 18, paddingRight:20 }}>
          Score: {score}
        </span>
      </div>
    </Navbar>

    <div className="quiz dark-mode" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="content text-center">
        <h1 className="display-1">{placeholder_phrase[lang_counter]}</h1>
        <h3 className="mb-4">Round: {round}/6</h3>
        <Accordion defaultActiveKey="1" className="w-100">
          {hints.map((hint, index) => (
            <Accordion.Item eventKey={index.toString()} key={index} color='white'>
              <Accordion.Header>{hint.split(',')[0]}</Accordion.Header> {/* Use hint for accordion title */}
              <Accordion.Body eventKey="1">{hint}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <Form className="d-flex align-items-center justify-content-center mb-3 w-100">
          <Form.Group controlId="language-select" className="me-2 flex-grow-1">
            <Form.Select value={selectedLanguage} onChange={handleChange} disabled={gameOver} className="btn-primary">
              <option value="">Choose a language</option>
              {Object.keys(languages).map((language, index) => (
                <option key={index} value={language}>{language}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button 
            variant="primary"
            disabled={!selectedLanguage || gameOver}
            onClick={handleSelectButtonClick}
          >
            Submit
          </Button>
        </Form>
       
        {(gameOver || round >= 5) && (
          <Button variant="primary" className="w-100 my-2" onClick={handleStartOverClick}>Next Round</Button>
        )}
      </div>
    </div>
    </div>
  );
}

export default EndlessMode;
