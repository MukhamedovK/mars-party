export function HangmanWord({ guessedLetters, wordToGuess, reveal = false }) {
    return (
      <div className="flex gap-4 text-7xl font-extrabold uppercase font-mono tracking-widest justify-center">
        {wordToGuess.split("").map((letter, index) => (
          <span
            key={index}
            className="border-b-8 border-primary pb-3 transition-all duration-300 hover:scale-110 hover:text-primary"
          >
            <span
              className={`${
                guessedLetters.includes(letter) || reveal ? "visible" : "invisible"
              } ${!guessedLetters.includes(letter) && reveal ? "text-error" : "text-base-content"}`}
            >
              {letter}
            </span>
          </span>
        ))}
      </div>
    );
  }