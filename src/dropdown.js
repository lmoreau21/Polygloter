import React, { useState, useEffect } from 'react';
import languages from './languages.json';

function Dropdown() {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [hints, setHints] = useState([]);
    const [round, setRound] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [lang_counter, setLangCounter] = useState(0); 

    const phrases = 'How are you doing?';
    const correctLanguage = ['French','Chinese']; 
    const placeholder_phrase = ['Comment allez-vous','你好吗'];
    const hintsForLanguages = languages; 

    useEffect(() => {
        if (gameOver) {
            alert(`Congratulations! You've guessed the correct language: ${correctLanguage[lang_counter]}`);
        } else if (round >= 5) {
            alert(`Failed! The correct language: ${correctLanguage[lang_counter]}`);
        }
    }, [gameOver, round]);

    useEffect(() => {
        const selectButton = document.getElementById('select-button');
        const handleSelectButtonClick = () => {
            if (!gameOver && selectedLanguage !== correctLanguage[lang_counter] && round < 5) {
                if (round === 0) {
                    setHints(hints.concat(`Guess: ${selectedLanguage}, Hint: Phrase in English: ${phrases}`));
                } else {
                    setHints(hints.concat(`Guess: ${selectedLanguage}, Hint: ${hintsForLanguages[correctLanguage[lang_counter]][`hint${round}`]}`));
                }
                setRound(round + 1);
            } else if (selectedLanguage === correctLanguage[lang_counter]) {
                setGameOver(true);
            }
        };
        selectButton.addEventListener('click', handleSelectButtonClick);
        return () => { 
            selectButton.removeEventListener('click', handleSelectButtonClick); 
        };
    }, [selectedLanguage, gameOver, round]);

    // Add this function
    const handleStartOverClick = () => {
        setRound(1);
        setHints([])
        setGameOver(false);
        setLangCounter((lang_counter + 1) % correctLanguage.length);
    };

    const handleChange = (event) => {
        setSelectedLanguage(event.target.value);
    }

    return (
        <div className="App">
            <h2>{placeholder_phrase[lang_counter]}</h2>
            <div className="controls">
                <select id="language-select" value={selectedLanguage} onChange={handleChange}>
                    <option value="">Choose a language</option>
                    {Object.keys(languages).map((language, index) => (
                        <option key={index} value={language}>
                            {language}
                        </option>
                    ))}
                </select>
                <button id="select-button" disabled={!selectedLanguage || gameOver}>Select</button>
            </div>
            <div id="hints">
                {hints.map((hint, index) => (
                    <p key={index}>{hint}</p>
                ))}
            </div>
            <p>Round: {round}</p>
            
            {(gameOver || round >= 5) && (
                <button onClick={handleStartOverClick}>Start Over</button> 
            )}
        </div>
    );
}

export default Dropdown;
