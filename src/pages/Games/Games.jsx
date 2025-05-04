import React from 'react';
import { Link } from 'react-router-dom';
import { IoGameController } from 'react-icons/io5';

const iframeGames = [
  {
    id: '2048',
    title: '2048',
    src: 'https://play2048.co/',
    image: 'https://play-lh.googleusercontent.com/5JrXBphEEsLGqTbdEUKzmfjT2QWuQOI_CwU7r6G53SBNRrSRj1VFL4CY6Ue19z9irYQr',
  },
  {
    id: 'pacman',
    title: 'Pacman',
    src: 'https://www.retrogames.cc/embed/27647-pac-man.html',
    image: 'https://www.desura.games/files/images/19/1916287073371ef1ed76f05bf40ef4f7.jpg',
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    src: 'https://minesweeper.online/',
    image: 'https://minesweeper.online/img/homepage/intermediate_night.png',
  },
  {
    id: 'dino',
    title: 'Dino Game',
    src: 'https://chromedino.com/',
    image: 'https://play-lh.googleusercontent.com/iiIJq5JmLFYNI1bVz4IBHyoXs508JcEzHhOgau69bnveF9Wat51-ax9LMPVOlneKwqg',
  },
  {
    id: 'solitaire',
    title: 'Solitaire',
    src: 'https://www.solitr.com/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/28/fe/5c/28fe5c64-3da2-61c0-1ec7-d5b315ace360/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    src: 'https://sudoku.com/',
    image: 'https://hourglassnewspaper.com/wp-content/uploads/2022/02/normalsolutions.jpg',
  },
];

const Games = () => {
  return (
    <div className="flex-1 p-4">
      <div className="mb-6">
        <p className="text-3xl text-primary font-bold flex items-center gap-3">
          <IoGameController /> Games list:
        </p>
      </div>

      <div className="flex flex-wrap gap-6">
        {/* Old games */}
        <Link to="/games/Quiz/lobby">
          <div className="w-72 rounded-2xl border-4 border-teal-400 overflow-hidden hover:scale-105 transition">
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20230803112200/Quiz.webp"
              alt="Quiz game"
              className="rounded-2xl w-full h-48 object-cover"
            />
            <p className="text-center font-bold py-2 bg-white">Quiz</p>
          </div>
        </Link>

        <Link to="/games/hangman">
          <div className="w-72 rounded-2xl border-4 border-teal-400 overflow-hidden hover:scale-105 transition">
            <img
              src="https://m.media-amazon.com/images/I/81xt2+PD0IL.png"
              alt="Hangman game"
              className="rounded-2xl w-full h-48 object-cover"
            />
            <p className="text-center font-bold py-2 bg-white">Hangman</p>
          </div>
        </Link>

        {/* New iframe games */}
        {iframeGames.map((game) => (
          <Link key={game.id} to={`/games/iframe/${game.id}`}>
            <div className="w-72 rounded-2xl border-4 border-blue-400 overflow-hidden hover:scale-105 transition shadow-md">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-48 object-cover"
              />
              <p className="text-center font-bold py-2 bg-white">{game.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Games;
