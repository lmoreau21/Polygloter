import React, { useState, useEffect } from 'react';
import { Accordion, Button, Form, Modal, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Select from 'react-select';
import { ChevronLeft } from 'react-feather';
import languages from '../hints.json';
import languageData from '../languages.json';
import '../custom-styles.css';
import MapChart from './Map';
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import HeadShake from 'react-reveal/HeadShake';
function DailyChallenge() {
  const { width, height } = useWindowSize();
  const [currentChallenge, setCurrentChallenge] = useState({});
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

  const [gameWon, setGameWon] = useState(false);
  // Assuming 'guessedLanguages' length is used to determine the last item
  const initialActiveKey = guessedLanguages.size > 0 ? (guessedLanguages.size - 1).toString() : "0";
  const [activeKeys, setActiveKeys] = useState([initialActiveKey]);

  const hintsEnabled = true; // Assuming hintsEnabled is stored in localStorage
  const [correctLanguage,setCorrectLanguage] = useState("");
  const [hasDone, setHasDone] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    let savedGuessedLanguages = JSON.parse(localStorage.getItem('guessedLanguages')) || [];
    const savedHints = JSON.parse(localStorage.getItem('hints')) || [];
    const loadedHistory = JSON.parse(localStorage.getItem('history')) || [];
    updateHistoryAndAverage(loadedHistory);
    const dayOfMonth = new Date().getDate();
    const index = dayOfMonth % languageData.length;
    setCurrentChallenge(languageData[index]);
    setCorrectLanguage(currentChallenge.name);
  
    if (lastAttemptDate !== today) {
      resetForNewDay(today);
    } else {
      setGuessedLanguages(new Set(savedGuessedLanguages));
      setHints(savedHints);
      if(round<=5){
      setRound(savedGuessedLanguages.length + 1);}
      setActiveKeys(savedGuessedLanguages.length > 0 ? [(savedGuessedLanguages.length - 1).toString()] : ["0"]);
     
      if ((savedGuessedLanguages.includes(languageData[index].name) || round > 6 ) && !hasDone) {
        if(savedGuessedLanguages.includes(languageData[index].name)){
          setGameWon(true);
        }
        setHasDone(true);
        setRound(savedGuessedLanguages.length);
        setGameOver(true);
        endGame((savedGuessedLanguages.includes(languageData[index].name), languageData[index].name), false);
      }
      
    }
  }, [lastAttemptDate, attemptCount]);

  const handleSelectButtonClick = () => {
    if (attemptCount >= 1) {
      alert("You have already made your attempt for today.");
      return;
    }
    if (guessedLanguages.has(selectedLanguage)) {
      alert("You have already guessed this language.");
      return;
    }
    const newGuessedLanguages = new Set(guessedLanguages).add(selectedLanguage);
    setGuessedLanguages(newGuessedLanguages);
    localStorage.setItem('guessedLanguages', JSON.stringify(Array.from(newGuessedLanguages)));

    if (!gameOver && selectedLanguage !== currentChallenge.name) {
      updateHints(newGuessedLanguages, selectedLanguage);
    } else if (selectedLanguage === currentChallenge.name) {
      endGame(true, false);
    }
  };

  const updateHints = (newGuessedLanguages, guessedLanguage) => {
    let newHint = `${guessedLanguage}, `;
    if (round === 1) {
      newHint += `Phrase in English: ${currentChallenge.englishPhrase}`;
    } else {
      const hintIndex = `hint${round - 1}`;
      const languageHints = languages[currentChallenge.name];
      newHint += languageHints[hintIndex];
    }
    const updatedHints = [...hints, newHint];
    setHints(updatedHints);
    localStorage.setItem('hints', JSON.stringify(updatedHints));
    if (round >= 6) {
      setRound(6);
      endGame(false);
    } else {
      setActiveKeys([(round-1).toString()]);
      setRound(round+ 1);
    }
    setSelectedLanguage('');
  };

  const endGame = (isSuccess , data = true) => {
    setGameOver(true);
    if(isSuccess){
      setGameWon(true);
    }
    const message = isSuccess ? `Congratulations! You've guessed the correct language: ${correctLanguage}` : `Nice try! The correct language was: ${correctLanguage}`;
    setResultMessage(message);
    setShowResultModal(true);
    if(round > 6){setRound(6);}
    updateHistoryAndAverage([...history, { date: new Date().toISOString().slice(0, 10), attempts: round, success: isSuccess }]);
    if(data){
      setAttemptCount(attemptCount + 1);
      localStorage.setItem('attemptCount', (attemptCount + 1).toString());
  }
  };

  
  const updateHistoryAndAverage = (updatedHistory) => {
    setHistory(updatedHistory);
    localStorage.setItem('history', JSON.stringify(updatedHistory));
    const validAttempts = updatedHistory.filter(record => typeof record.attempts === 'number');
    const totalAttempts = validAttempts.reduce((sum, record) => sum + record.attempts, 0);
    const avgAttempts = validAttempts.length > 0 ? totalAttempts / validAttempts.length : 0;
    setAverageAttempts(avgAttempts.toFixed(2));
  };

  const resetForNewDay = (today) => {
    setAttemptCount(0);
    setLastAttemptDate(today);
    localStorage.setItem('lastAttemptDate', today);
    localStorage.setItem('attemptCount', '0');
    localStorage.removeItem('guessedLanguages');
    localStorage.removeItem('hints');
    setGuessedLanguages(new Set());
    setHints([]);
    setRound(1);
    setGameOver(false);
    setActiveKeys(["0"]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (selectedLanguage) {
      handleSelectButtonClick();
    }
  };

  const sortedLanguages = Object.keys(languages).sort().map(language => ({
    value: language,
    label: language
  }));

  const toggleItem = (key) => {
    console.log("t:"+activeKeys.includes(key));
    if (activeKeys.includes(key)) {
      setActiveKeys(activeKeys.filter(activeKey => activeKey !== key));
    } else {
      setActiveKeys([...activeKeys, key.toString()]);
    }
   
  };

  return (
    <div style={{ backgroundColor:'#262d4c', minHeight: '100vh', bottom:30, width: '100%', display: 'flex', flexDirection: 'column'}}>
    <Navbar expand="lg" variant="dark">
      <div className="col-md-4 d-flex align-items-center">
              
      <Link to="/Polygloter/home">
        <ChevronLeft />
        {/* Rest of your code */}
      </Link>
      </div>
      <div className="col-md-4 d-flex justify-content-center">
        <span className="navbar-text" style={{ color: "#fff", fontSize: 34, display: "flex", justifyContent: "center", alignItems: "center" }}>
          Polygloter
        </span>
      </div>
      <div className="col-md-4 d-flex justify-content-end">
        <span className="navbar-text" style={{ color: "#fff", fontSize: 18, paddingRight:20 }}>
           Daily
        </span>
      </div>
    </Navbar>
    {showResultModal && gameWon && <Confetti width={width} height={height} style={{zIndex:"2"}}/>}
    <Modal show={showResultModal} onHide={attemptCount > 0 ? () => {} : () => setShowResultModal(false)} centered>
      <Modal.Header>
        <Modal.Title style={{color:'#fff'}}>{resultMessage}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{color:'#fff'}}>
        {gameOver && <p>You guessed it in {round} rounds.</p>}
        <p>Total games played: {history.length}</p>
        <p>Your average attempts: {averageAttempts}</p>
      </Modal.Body>
      {(
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
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center' }}>
          
        <Accordion alwaysOpen>
        {(Array.from(guessedLanguages)).reverse().map((language, index) => {
          const itemKey = index.toString();
          const hint = hints.find(hint => hint.startsWith(language));
          return (
            <Accordion.Item eventKey={itemKey} key={index}>
              <Accordion.Header >
              {index === 0 ? round === 2 ?  <HeadShake>{language}</HeadShake>:
                    <HeadShake spy={round}> {language}</HeadShake> : 
                    language}
               
              </Accordion.Header>
             
                <Accordion.Body>
                  {(index === 0 && round >= 6) ? 
                  
                     <MapChart language={currentChallenge.name}/> : 
                     ((index === 5) ? 'No Hint Available' : hint.split(',')[1])
                    }
                </Accordion.Body>
              
            </Accordion.Item>
          );
        })}

        </Accordion>
        {!gameOver && 
      <Form className="d-flex" style={{ width: '80%', alignItems:'flex-start', zIndex:4 }} onSubmit={handleFormSubmit}>
        <Form.Group controlId="language-select" style={{width:'100%', textAlign:'left', color:'white'}}>
        <Select 
            options={sortedLanguages}
            value={selectedLanguage ? { label: selectedLanguage, value: selectedLanguage } : null}
            onChange={(selectedOption) => setSelectedLanguage(selectedOption ? selectedOption.value : '')}
            isDisabled={gameOver}
            isSearchable={true}
            
            placeholder="Language"
            onKeyDown={ (event) => {if(event.key === 'Enter'){handleSelectButtonClick}}}
            styles={{
              color:'white',
              dropdownIndicator: (base, state) => ({
                ...base,
                color: 'white', // Set the color of the dropdown indicator
                ':hover': {
                  color: '#ffa28b', 
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
                backgroundColor: 'transparent',
                color: 'white',
              
                ':hover': {
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
      </div>
    </div>
    </div>
  );
}

export default DailyChallenge;
