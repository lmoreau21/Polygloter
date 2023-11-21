import React, { useState, useEffect } from 'react';
import languages from '../hints.json';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom-styles.css';
import { ChevronLeft } from 'react-feather';
import languageData from '../languages.json';
import Select from 'react-select';
import { Link } from "react-router-dom";

function DailyChallenge() {
  // State for the current language challenge
  const [currentChallenge, setCurrentChallenge] = useState({});

  // Other states
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [hints, setHints] = useState([]);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [guessedLanguages, setGuessedLanguages] = useState(new Set());
  const [lastAttemptDate, setLastAttemptDate] = useState(localStorage.getItem('lastAttemptDate') || '');
  const [attemptCount, setAttemptCount] = useState(parseInt(localStorage.getItem('attemptCount')) || 0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [averageAttempts, setAverageAttempts] = useState(0);
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('history')) || []);
  const darkMode = localStorage.getItem('darkMode') !== 'false';
  const hintsEnabled = localStorage.getItem('hintsEnabled') !== 'false';

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const savedGuessedLanguages = JSON.parse(localStorage.getItem('guessedLanguages')) || [];
    const savedHints = JSON.parse(localStorage.getItem('hints')) || [];
  
    // Selecting the daily challenge
    const dayOfMonth = new Date().getDate();
    const index = dayOfMonth % languageData.length;
    const newChallenge = languageData[index];
    setCurrentChallenge(newChallenge);
  
    // Handle if the current day is different from the last attempt
    if (lastAttemptDate !== today) {
      setAttemptCount(0);
      setLastAttemptDate(today);
      localStorage.setItem('lastAttemptDate', today);
      localStorage.setItem('attemptCount', '0');
      localStorage.removeItem('guessedLanguages'); // Clear saved guessed languages
      localStorage.removeItem('hints'); // Clear saved hints
      setGuessedLanguages(new Set()); // Reset for new day
      setHints([]); // Reset hints
      setRound(1);
      setGameOver(false);
    } else {
      setGuessedLanguages(new Set(savedGuessedLanguages)); // Load saved guessed languages
      setHints(savedHints); // Load saved hints
      // Check if game is over and set the round number
      if (savedGuessedLanguages.length > 0 && newChallenge.name === savedGuessedLanguages[savedGuessedLanguages.length - 1]) {
        setGameOver(true);
        setRound(savedGuessedLanguages.length);
      } else {
        setGameOver(false);
        setRound(savedGuessedLanguages.length + 1);
      }
    }
  
    const totalAttempts = history.reduce((sum, record) => sum + record.attempts, 0);
    const avg = history.length > 0 ? totalAttempts / history.length : 0;
    setAverageAttempts(avg.toFixed(2));
  }, [history, lastAttemptDate, attemptCount]);

  const handleSelectButtonClick = () => {
    if (attemptCount >= 1) {
      alert("You have already made your attempt for today.");
      return;
    }

    if (guessedLanguages.has(selectedLanguage)) {
      alert("You have already guessed this language.");
      return;
    }
  
    const correctLanguage = currentChallenge.name;
    const newGuessedLanguages = new Set(guessedLanguages).add(selectedLanguage);
    setGuessedLanguages(newGuessedLanguages);
    localStorage.setItem('guessedLanguages', JSON.stringify(Array.from(newGuessedLanguages)));
    if (!gameOver && selectedLanguage !== correctLanguage) {
      // Generate hint based on round
      let newHint = '';
      if (round === 1) {
        newHint = `${selectedLanguage}, Phrase in English: ${currentChallenge.englishPhrase}`;
      } else {
        const hintIndex = `hint${round - 1}`;
        const languageHints = languages[correctLanguage];
        newHint = languageHints ? `${selectedLanguage}, ${languageHints[hintIndex] || 'No hint available'}` : 'No hints available for this language.';
      }
  
      // Update guessed languages and hints
      const newGuessedLanguages = new Set(guessedLanguages).add(selectedLanguage);
      const newHints = [...hints, newHint];
      
      setHints(newHints);
      localStorage.setItem('hints', JSON.stringify(newHints));
  
      if (round === 6) {
        setGameOver(true);
        setShowResultModal(true);
      } else {
        setRound(newGuessedLanguages.size + 1);
      }
      setSelectedLanguage(''); 
    } else if (selectedLanguage === correctLanguage) {
      setGameOver(true);
      const successMessage = `Congratulations! You've guessed the correct language: ${correctLanguage}`;
      setResultMessage(successMessage); // Set success message
      setShowResultModal(true);
      // Add a hint with the correct answer
      setHints([...hints, `${selectedLanguage}, Correct Answer`]);
      setSelectedLanguage(''); 
    }else{
      const failureMessage = `Nice try! The correct language was: ${correctLanguage}`;
      setResultMessage(failureMessage); // Set failure message
      setShowResultModal(true);
    }
    if (gameOver) {
      const newRecord = {
          date: new Date().toISOString().slice(0, 10),
          attempts: round,
          success: selectedLanguage === correctLanguage
      };
      const newHistory = [...history, newRecord];
      setHistory(newHistory);
      localStorage.setItem('history', JSON.stringify(newHistory));
  
      const totalAttempts = newHistory.reduce((sum, record) => sum + record.attempts, 0);
      const avgAttempts = newHistory.length > 0 ? totalAttempts / newHistory.length : 0;
      setAverageAttempts(avgAttempts.toFixed(2));
  
      const message = selectedLanguage === correctLanguage 
          ? `Congratulations! You've guessed the correct language: ${correctLanguage}` 
          : `Nice try! The correct language was: ${correctLanguage}`;
      setResultMessage(message);
      setShowResultModal(true);
  
      setAttemptCount(attemptCount + 1);
      localStorage.setItem('attemptCount', (attemptCount + 1).toString());
  }
  
    
  };
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevents form from causing page reload
    if (selectedLanguage) {
      handleSelectButtonClick(); // Calls the existing button click handler
    }
  };
  const sortedLanguages = Object.keys(languages).sort().map(language => ({
    value: language,
    label: language
  }));

  return (
    <div style={{ backgroundColor:'#262d4c', minHeight: '100vh', bottom:30, width: '100%', display: 'flex', flexDirection: 'column'}}>
    <Navbar expand="lg" variant="dark">
      <div className="col-md-4 d-flex align-items-center">
              
      <Navbar.Brand as={Link} to="/Polygloter/home">
        <ChevronLeft />
        {/* Rest of your code */}
      </Navbar.Brand>
      </div>
      <div className="col-md-4 d-flex justify-content-center">
        <span className="navbar-text" style={{ color: "#fff", fontSize: 34 }}>
          Polygloter
        </span>
      </div>
      <div className="col-md-4 d-flex justify-content-end">
        <span className="navbar-text" style={{ color: "#fff", fontSize: 18, paddingRight:20 }}>
          {/* Daily Challenge */}
        </span>
      </div>
    </Navbar>

    <Modal show={showResultModal} onHide={attemptCount > 0 ? () => {} : () => setShowResultModal(false)} centered>
      <Modal.Header>
        <Modal.Title style={{color:'#fff'}}>{resultMessage}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{color:'#fff'}}>
        {gameOver && <p>You guessed it in {round} rounds.</p>}
        <p>Total games played: {history.length}</p>
        <p>Your average attempts: {averageAttempts}</p>
      </Modal.Body>
      {attemptCount === 0 && (
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowResultModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      )}
    </Modal>


    <div className="quiz dark-mode" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 40, alignItems: 'center', width:'100%', overflow:'hidden'}}>
      <div className="content text-center">
        <h1 className="display-1">{currentChallenge.phrase}</h1>
        <h3 className="mb-4">Round: {round}/6</h3>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <Accordion alwaysOpen style={{ width: '80%' }}>
          {Array.from(guessedLanguages).map((language, index) => {
            const hint = hints.find(hint => hint.startsWith(language));
            return (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{language}</Accordion.Header>
                {hintsEnabled && (
                  <Accordion.Body>
                    {hint ? hint.split(',')[1] : 'No hint available'}
                  </Accordion.Body>
                )}
              </Accordion.Item>
            );
          })}
        </Accordion>


      {!gameOver && 
      <Form className="d-flex" style={{ width: '80%' }} onSubmit={handleFormSubmit}>
        <Form.Group controlId="language-select" style={{width:'100%', textAlign:'left', color:'white'}}>
        <Select 
            options={sortedLanguages}
            value={selectedLanguage ? { label: selectedLanguage, value: selectedLanguage } : null}
            onChange={(selectedOption) => setSelectedLanguage(selectedOption ? selectedOption.value : '')}
            isDisabled={gameOver}
            isSearchable={true}
            placeholder="Select a language..."
            
            styles={{
              dropdownIndicator: (base, state) => ({
                ...base,
                color: 'white', // Set the color of the dropdown indicator
                ':hover': {
                  color: '#ffa28b7f', 
                },
                ':active': {
                  color: 'white', 
                },
                
              }),
              control: (provided) => ({
                ...provided,
                backgroundColor: 'rgba(92, 103, 153, 0.5)',
                color: 'white',
                border: 'white',
                boxShadow: 'none'
              }),
              menuList: (provided) => ({
                ...provided,
                // maxHeight: '250px', // Limit the height of the dropdown list
                overflowY: 'auto',  // Enable scrolling inside the dropdown list
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: '#262d4c',
                color: 'white',
                overflow: 'hidden',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? '#ffa28b7f' : 'transparent',
                color: 'white',
                ':active': {
                  backgroundColor: '#ffa28b7f',
                },
              }),
              singleValue: (provided) => ({
                ...provided,
                color: 'white',
              }),
              input: (provided) => ({
                ...provided,
                color: 'white', // Sets the color of input text
              }),
            }}
          />
        </Form.Group>
        <Button variant="primary"  type="submit"  disabled={!selectedLanguage || gameOver}>
          Submit
        </Button>
      </Form>}
      </div>
      </div>
    </div>
    </div>
  );
}

export default DailyChallenge;
