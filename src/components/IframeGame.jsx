import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Updated game URLs, prioritizing embed-friendly sources
const iframeGames = {
  '2048': 'https://2048game.com/',
  'tetris': 'https://www.retrogames.cc/embed/27648-tetris.html',
  'pacman': 'https://www.retrogames.cc/embed/27647-pac-man.html',
  'minesweeper': 'https://minesweeper.online/',
  'dino': 'https://chromedino.com/',
  'solitaire': 'https://www.solitr.com/',
  'sudoku': 'https://sudoku.com/',
};

const IframeGame = () => {
  const { id } = useParams();
  const gameUrl = iframeGames[id];

  if (!gameUrl) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
        }}
      >
        <p className="text-red-500 font-bold text-2xl mb-4">O'yin topilmadi :(</p>
        <Link
          to="/games"
          className="text-blue-500 underline hover:text-blue-700 transition"
        >
          Ortga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-full h-screen relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <iframe
        src={gameUrl}
        title={id}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
        loading="lazy"
        onError={() => (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <p className="text-white font-bold text-xl mb-4">
              O'yin yuklanmadi. Iltimos, boshqa o'yinni sinab ko'ring.
            </p>
            <Link
              to="/games"
              className="text-blue-400 underline hover:text-blue-600"
            >
              Ortga qaytish
            </Link>
          </div>
        )}
      />
    </div>
  );
};

export default IframeGame;