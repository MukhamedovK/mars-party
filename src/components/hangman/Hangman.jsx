import { useState, useEffect, useCallback } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import words from "./wordList.json";

const getWord = () => words[Math.floor(Math.random() * words.length)];

function Hangman() {
  const [wordToGuess, setWordToGuess] = useState(getWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  const incorrectLetters = guessedLetters.filter((letter) => !wordToGuess.includes(letter));
  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess.split("").every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;
      setGuessedLetters((current) => [...current, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  const resetGame = useCallback(() => {
    setGuessedLetters([]);
    setWordToGuess(getWord());
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (!key.match(/^[a-z]$/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener("keypress", handleKey);
    return () => document.removeEventListener("keypress", handleKey);
  }, [addGuessedLetter]);

  useEffect(() => {
    const handleReset = (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      resetGame();
    };
    document.addEventListener("keypress", handleReset);
    return () => document.removeEventListener("keypress", handleReset);
  }, [resetGame]);

  return (
    <div className="flex flex-col gap-6 items-center p-6 w-full h-full bg-base-100 rounded-xl shadow-lg">
      {(isWinner || isLoser) && (
        <div
          className={`alert ${
            isWinner ? "alert-success" : "alert-error"
          } w-full max-w-sm rounded-lg shadow-md transition-all duration-300`}
        >
          <span className="text-lg font-semibold text-center text-white">
            {isWinner && "G‘alaba! Enter bilan yangilang"}
            {isLoser && "Yutqazdingiz! Enter bilan yangilang"}
          </span>
        </div>
      )}
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div className="w-full flex flex-col gap-4">
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter((letter) => wordToGuess.includes(letter))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
        <button
          onClick={resetGame}
          className="btn btn-primary w-full max-w-xs mx-auto text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus hover:scale-102 transition-all duration-200"
        >
          Yangi O‘yin
        </button>
      </div>
    </div>
  );
}

export default Hangman;