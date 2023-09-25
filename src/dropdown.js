import React, { useState, useEffect } from 'react';
import languages from './languages.json';

function Dropdown() {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [hints, setHints] = useState([]);
    const [round, setRound] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const phrases = 'Good morning!'; 
    const correctLanguage = 'English'; // replace with the correct language
    const hintsForLanguages = languages; // replace with your hints object

    useEffect(() => {
        if (gameOver) {
            alert(`Congratulations! You've guessed the correct language: ${correctLanguage}`);
        } else if (round >= 5) {
            alert(`Failed! The correct language: ${correctLanguage}`);
        }
    }, [gameOver, round]);

    useEffect(() => {
        const selectButton = document.getElementById('select-button');
        const handleSelectButtonClick = () => {
            if (!gameOver && selectedLanguage !== correctLanguage && round < 5) {
                if (round === 0) {
                    setHints(hints.concat(`Guess: ${selectedLanguage}, Hint: Phrase in English: ${phrases}`));
                } else {
                    setHints(hints.concat(`Guess: ${selectedLanguage}, Hint: ${hintsForLanguages[correctLanguage][`hint${round}`]}`));
                }
                setRound(round + 1);
            } else if (selectedLanguage === correctLanguage) {
                setGameOver(true);
            }
        };
        selectButton.addEventListener('click', handleSelectButtonClick);

        // Cleanup function to remove the event listener
        return () => {
            selectButton.removeEventListener('click', handleSelectButtonClick);
        };
    }, [selectedLanguage, round, hints, gameOver]);

    const handleChange = (event) => {
        setSelectedLanguage(event.target.value);
    }

    return (
        <div className="App">
            <h2>{phrases}</h2>
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
                <button onClick={() => window.location.reload()}>Start Over</button>
            )}
        </div>
    );
}

export default Dropdown;
