import React, { useState, useEffect } from 'react';
import { MdOutlineSensorDoor } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket';

const LobbyWaiting = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [modalMode, setModalMode] = useState(null); // 'create' or 'join'
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');

    useEffect(() => {
        // Roomlar ro'yxati, yaratish va ulanishni socket orqali kuzatamiz
        socket.on('rooms-list', (data) => {
            setRooms(data);
        });

        socket.on('room-created', ({ roomId }) => {
            navigate(`/games/Quiz/room/${roomId}`);
        });

        socket.on('room-joined', ({ roomId }) => {
            navigate(`/games/Quiz/room/${roomId}`);
        });

        socket.on('error', (msg) => {
            alert(msg);
        });

        return () => {
            socket.off('rooms-list');
            socket.off('room-created');
            socket.off('room-joined');
            socket.off('error');
        };
    }, [navigate]);

    const handleModalSubmit = () => {
        if (!username.trim()) {
            return alert("Please enter your username");
        }

        if (modalMode === 'create') {
            socket.emit('create-room', { username });
        } else if (modalMode === 'join') {
            if (!roomId.trim()) {
                return alert("Please enter room ID");
            }
            socket.emit('join-room', { roomId, username });
        }

        document.getElementById('roomModal').close();
        setModalMode(null);
        setRoomId('');
    };

    return (
        <div className='flex-1 flex flex-col gap-5'>
            <div className='flex items-center justify-end gap-2'>
                <button className='btn btn-primary' onClick={() => {
                    setModalMode('join');
                    document.getElementById('roomModal').showModal();
                }}>
                    <MdOutlineSensorDoor />
                    Join Room
                </button>
                <button className='btn btn-primary' onClick={() => {
                    setModalMode('create');
                    document.getElementById('roomModal').showModal();
                }}>
                    <IoMdAdd />
                    <span>Create Room</span>
                </button>
            </div>

            <div className='bg-base-300 flex-1 rounded-xl p-5 max-h-[492px] flex flex-col gap-2 overflow-y-auto'>
                <p className='text-2xl font-bold mb-4'>Public Rooms List:</p>
                {
                    rooms.length > 0 ? (
                        rooms.map((item, id) => (
                            item.public && (
                                <div className='p-2 bg-base-100 rounded-xl border border-success flex items-center justify-between' key={id}>
                                    <div>
                                        <p><b>ID:</b> {item.id}</p>
                                        <p><b>Owner:</b> {item.owner}</p>
                                    </div>
                                    <button 
                                        className='btn btn-secondary'
                                        onClick={() => {
                                            if (!username.trim()) {
                                                return alert("Please enter your username first (click Join Room button)");
                                            }
                                            socket.emit('join-room', { roomId: item.id, username });
                                        }} 
                                    >
                                        Join
                                    </button>
                                </div>
                            )
                        ))
                    ) : (
                        <p>No Rooms yet</p>
                    )
                }
            </div>

            <dialog id="roomModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">
                        {modalMode === 'create' ? "Create a Room" : "Join a Room"}
                    </h3>

                    <input
                        type="text"
                        placeholder="Enter your username"
                        className="input input-bordered w-full mb-3"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {modalMode === 'join' && (
                        <input
                            type="text"
                            placeholder="Enter room ID"
                            className="input input-bordered w-full mb-3"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                    )}

                    <div className="modal-action">
                        <form method="dialog" className='flex gap-2'>
                            <button type="button" onClick={handleModalSubmit} className="btn btn-primary">
                                Submit
                            </button>
                            <button className="btn" onClick={() => {
                                document.getElementById('roomModal').close();
                                setModalMode(null);
                                setRoomId('');
                            }}>Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default LobbyWaiting;
