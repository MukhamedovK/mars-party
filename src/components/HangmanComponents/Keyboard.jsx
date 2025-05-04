import React from 'react';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Keyboard = ({ onClick, hidden }) => {
  if (hidden) return null;

  return (
    <div className="relative p-4 max-w-[700px] mx-auto flex flex-wrap justify-center gap-3">
      {letters.map((letter) => (
        <div
          key={letter}
          className="p-[1.5px] rounded-lg bg-gradient-to-br from-teal-800 to-cyan-700"
        >
          <button
            onClick={() => onClick(letter)}
            className="bg-base-200 font-semibold text-lg w-[60px] h-[60px] rounded-md flex items-center justify-center transition hover:scale-110"
          >
            {letter}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
