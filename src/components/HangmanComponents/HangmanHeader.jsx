import React from "react";

const ITEMS = ["frontend", "backend", "design"];

export const Header = ({ setTopic, score }) => {
  return (
    <header className="bg-base-300 px-8 py-2 shadow-xl rounded-b-3xl flex flex-col w-full gap-4 items-center">
      {/* Title */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider drop-shadow-md">
          🎯 Hangman Challenge
        </h1>
        <p className="text-lg font-semibold text-warning ">
          🏆 Score: <span className="">{score}</span>
        </p>

      </div>
      {/* Score and Topics */}
      <nav className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        <p className="font-semibold text-md sm:text-lg">
          🧠 Topics:
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          {ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => setTopic(item)}
              className="uppercase px-5 py-2 bg-base-100 text-primary rounded-full font-bold hover:bg-error hover:text-neutral-50 cursor-pointer transition-all duration-200 shadow-md hover:scale-105"
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};
