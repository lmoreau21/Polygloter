import React, { useState, useEffect } from 'react';
import languages from '../hints.json';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom-styles.css';
import { ChevronLeft } from 'react-feather';
import languageData from '../languages.json';
import Select from 'react-select';
import { Modal } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { FiHelpCircle } from 'react-icons/fi'; 
import MapChart from './Map';


function EndlessMode() {
  const [currentChallenge, setCurrentChallenge] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [hints, setHints] = useState([]);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [guessedLanguages, setGuessedLanguages] = useState(new Set());
  const darkMode = localStorage.getItem('darkMode') !== 'false';
  const hintsEnabled = localStorage.getItem('hintsEnabled') !== 'false';
  const [openItem, setOpenItem] = useState("0");


  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('highScore')) || 0
  );
  const [showModal, setShowModal] = useState(false); // State for controlling modal visibility

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (gameOver) {
      const newHighScore = Math.max(score, highScore);
      localStorage.setItem('highScore', newHighScore.toString());
      setHighScore(newHighScore);
      setShowModal(true); 
    }
  }, [gameOver, score, highScore]);

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * languageData.length);
    setCurrentChallenge(languageData[randomIndex]);
    setRound(1);
    setHints([]);
    setGameOver(false);
    setSelectedLanguage('');
    setGuessedLanguages(new Set());
    console.log(languageData[randomIndex].name)
  };

  const handleSelectButtonClick = () => {
    if (guessedLanguages.has(selectedLanguage)) {
      alert("You have already guessed this language.");
      return;
    }

    const correctLanguage = currentChallenge.name;
    if (selectedLanguage === correctLanguage) {
      setScore(score + 1);
      alert(`Congratulations! You've guessed the correct language: ${correctLanguage}`);
      proceedToNextRound();
       
    } else {
      if (round === 6) {
        setGameOver(true);
        
      } else {
        updateHints();
        setActiveKeys((round-1).toString())
        setRound(round + 1);
      }
      
    }
  };

  const updateHints = () => {
    let newHint = '';
    const correctLanguage = currentChallenge.name;
  
    if (round === 1) {
      newHint = `${selectedLanguage}, Phrase in English: ${currentChallenge.englishPhrase}`;
    } else {
      const hintIndex = `hint${round - 1}`;
      const languageHints = languages[correctLanguage];
      newHint = languageHints ? `${selectedLanguage}, ${languageHints[hintIndex] || 'No hint available'}` : 'No hints available for this language.';
    }
    setGuessedLanguages(new Set(guessedLanguages).add(selectedLanguage));
    setHints([...hints, newHint]);
    setSelectedLanguage('');
  };

  const fullStartOver = () => {
    setShowModal(false);
    setGuessedLanguages(new Set());
    setGameOver(false);
    setScore(0);
    startNewGame();
  };

  
  const proceedToNextRound = () => {
    setShowModal(false);
    setGuessedLanguages(new Set());
    if (round > 6) {
      setGameOver(true);
      return;
    }
    startNewGame();
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

  const [activeKeys, setActiveKeys] = useState((round-1).toString()); // Initial state with last item open

  const toggleItem = (key) => {
    let newActiveKeys = [...activeKeys];
    if (newActiveKeys.includes(key)) {
      newActiveKeys = newActiveKeys.filter(k => k !== key);
    } else {
      newActiveKeys.push(key);
    }
    setActiveKeys(newActiveKeys);
  };

  return (
    <div style={{ backgroundColor:'#262d4c', minHeight: '100vh', paddingBottom:20, width: '100%', display: 'flex', flexDirection: 'column'}}>
       
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
          Score: {score}
        </span>
      </div>
    </Navbar>

    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header color='white' closeButton>
          <Modal.Title style={{color:'white'}}>Game Over</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color:'white'}}>Score: {score}</Modal.Body>
        {score < highScore && <Modal.Body style={{color:'white'}}>High Score: {highScore}</Modal.Body>}
        {score >= highScore && <Modal.Body style={{color:'white'}}>New high score!</Modal.Body>}
        <Modal.Footer>
          <Button variant="primary" onClick={() => fullStartOver()}>
            Start Over
          </Button>
        </Modal.Footer>
      </Modal>
    <div className="quiz dark-mode" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 40, alignItems: 'center', width:'100%', overflow:'hidden'}}>
      <div className="content text-center">
        <h1 className="display-1">{currentChallenge.phrase}</h1>
        <h3 className="mb-4">Round: {round}/6</h3>
       
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <Accordion  activeKey={activeKeys} alwaysOpen>
        {hints.map((hint, index) => {
            const isCorrectAnswer = hint.includes('Correct Answer');
            return (
              <Accordion.Item eventKey={index.toString()}>
                
                <Accordion.Header  onClick={() => toggleItem(index.toString())}>
                    {hint.split(',')[0]}
                  </Accordion.Header>
             
                  {!isCorrectAnswer && hintsEnabled && (
                  <Accordion.Body>
                    {index === 4 ? 
                     <MapChart language={currentChallenge.name}/>:
                      hint.split(',')[1]
                    }
                  </Accordion.Body>
                )}
              </Accordion.Item>
            );
          })}
        </Accordion>


      {!gameOver && 
      <Form className="d-flex" style={{ width: '80%', alignItems:'flex-start' }} onSubmit={handleFormSubmit}>
        <Form.Group controlId="language-select" style={{width:'100%',minHeight:'250px', textAlign:'left', color:'white'}}>
        <Select 
            options={sortedLanguages}
            value={selectedLanguage ? { label: selectedLanguage, value: selectedLanguage } : null}
            onChange={(selectedOption) => setSelectedLanguage(selectedOption ? selectedOption.value : '')}
            isDisabled={gameOver}
            isSearchable={true}
            
            placeholder="Select a language..."
            onKeyDown={ (event) => {if(event.key === 'Enter'){handleSelectButtonClick}}}
            styles={{
              color:'white',
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
                minHeight: '250px', // Limit the height of the dropdown list
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
        <Button variant="primary" type="submit" disabled={!selectedLanguage || gameOver} style={{height:40}}>
          Submit
        </Button>
      </Form>}
       
      </div>
      </div> </div>
    </div>
  );
}

export default EndlessMode;
