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
  const [showModal, setShowModal] = useState(false);
  const [record, setRecord] = useState('');
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastAttemptDate !== today) {
      setAttemptCount(0); // Reset attempt count if it's a new day
      setLastAttemptDate(today);
      localStorage.setItem('lastAttemptDate', today);
      localStorage.setItem('attemptCount', '0');
      selectDailyChallenge();
    }
  }, []);
  const selectDailyChallenge = () => {
    const today = new Date();
    const index = (today.getFullYear() + today.getMonth() + today.getDate()) % languageData.length;
    setCurrentChallenge(languageData[index]);
  };

  // Function to start a new game or round
  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * languageData.length);
    setCurrentChallenge(languageData[randomIndex]);
    setRound(1);
    setHints([]);
    setGameOver(false);
    setGuessedLanguages(new Set());
    console.log(languageData[randomIndex].name);
  };

  // Start a new game when the component mounts
  useEffect(startNewGame, []);

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
  
    if (!gameOver && selectedLanguage !== correctLanguage && round <= 6) {
      let newHint = '';
      if (round === 1) {
        newHint = `${selectedLanguage}, Phrase in English: ${currentChallenge.englishPhrase}`;
      } else {
        const hintIndex = `hint${round - 1}`;
        const languageHints = languages[correctLanguage];
        newHint = languageHints ? `${selectedLanguage}, ${languageHints[hintIndex] || 'No hint available'}` : 'No hints available for this language.';
      }
  
      setGuessedLanguages(new Set(guessedLanguages).add(selectedLanguage));
      setHints([...hints, newHint]);
  
      if (round === 6) {
        alert(`Failed! The correct language was: ${correctLanguage}`);
        setGameOver(true);
      } else {
        setRound(round + 1);
      }
      setSelectedLanguage(''); 
    } else if (selectedLanguage === correctLanguage) {
      setGameOver(true);
      alert(`Congratulations! You've guessed the correct language: ${correctLanguage}`);
      // Add a hint with the correct answer
      setHints([...hints, `${selectedLanguage}, Correct Answer`]);
      setSelectedLanguage(''); 
    }
    if(gameOver){
      setAttemptCount(attemptCount + 1);
      localStorage.setItem('attemptCount', (attemptCount + 1).toString());
    }
    
  };
    
  const sortedLanguages = Object.keys(languages).sort().map(language => ({
    value: language,
    label: language
  }));

  return (
    <div style={{ backgroundColor:'#262d4c', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column'}}>
    <Navbar expand="lg" variant="dark">
      <div className="col-md-4 d-flex align-items-center">
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <ChevronLeft />
          {/* Invisible spacer, same width as 'Daily Challenge' */}
          
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

    <div className="quiz dark-mode" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 40, alignItems: 'center', width:'100%', overflow:'hidden'}}>
      <div className="content text-center">
        <h1 className="display-1">{currentChallenge.phrase}</h1>
        <h3 className="mb-4">Round: {round}/6</h3>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Accordion alwaysOpen style={{ width: '80%' }}>
          {hints.map((hint, index) => {
            const isCorrectAnswer = hint.includes('Correct Answer');
            return (
              <Accordion.Item eventKey={index.toString()} key={index}>
                
                  <Accordion.Header>
                    {hint.split(',')[0]}
                  </Accordion.Header>
             
                {!isCorrectAnswer && (
                  <Accordion.Body>
                    {index === 4 ? 
                      languages[currentChallenge.name]['hint4'].map(item => (
                        <p key={item.country}>{item.country}: {item.percent}%</p>
                      )) :
                      hint.split(',')[1]
                    }
                  </Accordion.Body>
                )}
              </Accordion.Item>
            );
          })}
        </Accordion>


      {!gameOver && 
      <Form className="d-flex" style={{ width: '80%' }}>
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
                maxHeight: '250px', // Limit the height of the dropdown list
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
        <Button variant="primary" disabled={!selectedLanguage || gameOver} onClick={handleSelectButtonClick}>
          Submit
        </Button>
      </Form>}
       
        {(gameOver || round > 6) && (
        <Button variant="primary" className="w-50 my-2" onClick={startNewGame}>Start Over</Button>
      )}
      </div>
      </div>
    </div>
    </div>
  );
}

export default DailyChallenge;
