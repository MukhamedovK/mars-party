import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsQuestionSquare } from "react-icons/bs";
import { io } from "socket.io-client"; 

const jsQuestions = [
  { question: "What does typeof null return?", options: ["'null'", "'object'", "'undefined'", "'number'"], answer: "'object'" },
  { question: "Which method is used to parse JSON strings?", options: ["JSON.stringify()", "JSON.parse()", "parseJSON()", "stringifyJSON()"], answer: "JSON.parse()" },
  { question: "Which keyword declares a block-scoped variable?", options: ["var", "const", "let", "int"], answer: "let" },
  { question: "What will NaN === NaN return?", options: ["true", "false", "undefined", "null"], answer: "false" },
  { question: "Which of the following is NOT a JavaScript data type?", options: ["Boolean", "Float", "String", "Undefined"], answer: "Float" },
  { question: "Which symbol is used for comments in JavaScript?", options: ["//", "/* */", "#", "<!-- -->"], answer: "//" },
  { question: "What is the output of typeof NaN?", options: ["number", "NaN", "undefined", "object"], answer: "number" },
  { question: "Which function converts a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "String()"], answer: "parseInt()" }
];

const socket = io('https://backent-marshub-2.onrender.com');

const QuizGame = () => {
  const { roomId } = useParams();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [username, setUsername] = useState('');
  const [owner, setOwner] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
  }, []);

  useEffect(() => {
    socket.emit('get-room-info', { roomId });

    socket.on('room-info', ({ players, owner }) => {
      setPlayers(players);
      setOwner(owner);
    });

    socket.on('game-started', () => {
      setGameStarted(true);
      setLoading(false);
    });

    return () => {
      socket.off('room-info');
      socket.off('game-started');
    };
  }, [roomId]);

  const handleAnswer = (opt) => {
    if (!gameStarted) return;

    setSelected(opt);
    const isCorrect = opt === jsQuestions[currentQ].answer;
    if (isCorrect) setScore(prev => prev + 1);

    socket.emit('submit-answer', { roomId, playerId: username, answer: opt });

    setTimeout(() => {
      setSelected(null);
      if (currentQ + 1 < jsQuestions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        toast.success(`🎉 Game over! Your score is ${score + (isCorrect ? 1 : 0)}`, {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    }, 1000);
  };

  const handleStartGame = () => {
    setLoading(true);
    socket.emit('start-game', { roomId, username });
  };

  return (
    <div className="flex-1 flex items-start justify-between gap-4">
      <ToastContainer />
      <div className='flex flex-col gap-4 w-[300%]'>
        <div className='bg-base-100 p-4 flex gap-2 rounded-xl border border-primary'>
          <p className='text-warning font-bold'>Game ID:</p>
          <p className='font-medium text-error'>{roomId}</p>
        </div>
        <div className='bg-base-300 p-4 rounded-xl h-[60vh] overflow-y-auto'>
          <h3 className='font-semibold mb-2'>👥 Joined Players:</h3>
          <ul className='list-disc pl-5'>
            {players.map((p, idx) => (
              <li key={idx} className='text-sm'>
                {p} {p === owner && <span className='badge badge-primary ml-1'>Owner</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>      <div className="p-2 bg-base-200 h-[72vh] w-[800%] rounded-xl shadow-md border-2 border-primary flex flex-col gap-2 justify-between">
        <div>
          <img src="https://cdn.mos.cms.futurecdn.net/EzgdmaCQuT84bgDL4fhXZS.jpg" alt="" className='w-[100%] h-[30vh] rounded-xl' />
        </div>

        {gameStarted ? (
          <>
            <p className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BsQuestionSquare className='text-warning' /> {jsQuestions[currentQ].question}
            </p>
            <div className="grid gap-3">
              {jsQuestions[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className={`btn text-base ${selected === opt
                    ? (opt === jsQuestions[currentQ].answer ? 'btn-success' : 'btn-error')
                    : 'btn-outline'}`}
                  disabled={!!selected}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          username === owner ? (
            <button
              className="btn btn-primary"
              onClick={handleStartGame}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Start Game'
              )}
            </button>
          ) : (
            <p className="text-lg">Waiting for the owner to start the game...</p>
          )
        )}
      </div>
    </div>
  );
};

export default QuizGame;