import React from 'react';
import { Link } from 'react-router-dom';
import { IoGameController } from 'react-icons/io5';

const Games = () => {
  return (
    <div className="flex-1">
      <div className="my-2 mb-4">
        <p className="text-3xl text-primary font-bold flex items-center gap-3">
          <IoGameController /> Games list:
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Link to="/games/Quiz/lobby">
          <div className="max-w-[30%] rounded-2xl border-4 border-teal-400 overflow-hidden">
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20230803112200/Quiz.webp"
              alt="Quiz game"
              className="rounded-2xl w-full h-48 object-cover"
            />
            <p className="text-center font-bold">Quiz</p>
          </div>
        </Link>
        <Link to="/games/hangman">
          <div className="max-w-[30%] rounded-2xl border-4 border-teal-400 overflow-hidden">
            <img
              src="https://m.media-amazon.com/images/I/81xt2+PD0IL.png"
              alt="Hangman game"
              className="rounded-2xl w-full h-48 object-cover"
            />
            <p className="text-center font-bold">Hangman</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Games;