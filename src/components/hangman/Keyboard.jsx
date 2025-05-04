const KEYS = "abcdefghijklmnopqrstuvwxyz".split("");

export function Keyboard({ disabled, activeLetters, inactiveLetters, addGuessedLetter }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-4 w-full">
      {KEYS.map((key) => {
        const isActive = activeLetters.includes(key);
        const isInactive = inactiveLetters.includes(key);
        return (
          <button
            key={key}
            onClick={() => addGuessedLetter(key)}
            disabled={isActive || isInactive || disabled}
            className={`btn btn-lg btn-outline uppercase text-3xl font-bold h-18 shadow-md transition-all duration-300 ${isActive ? "btn-primary text-white" : ""
              } ${isInactive ? "btn-disabled opacity-50" : ""} ${!isActive && !isInactive
                ? "hover:btn-primary hover:text-white hover:scale-110 hover:shadow-xl"
                : ""
              }`}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}