import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaStar, FaLock, FaDownload, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const Projects = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem("rooms")) || [
      { id: "public", name: "Общая", isPrivate: false, password: "" },
    ];
    setRooms(savedRooms);
  }, []);

  useEffect(() => {
    if (currentRoom) {
      const roomProjects = JSON.parse(localStorage.getItem(`projects_${currentRoom.id}`)) || [];
      setProjects(roomProjects);
    } else {
      setProjects([]);
    }
  }, [currentRoom]);

  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
    if (currentRoom) {
      localStorage.setItem(`projects_${currentRoom.id}`, JSON.stringify(projects));
    }
  }, [rooms, projects, currentRoom]);

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom = {
      id: Date.now().toString(),
      name: newRoomName.trim(),
      isPrivate: roomPassword.length > 0,
      password: roomPassword,
    };
    setRooms([...rooms, newRoom]);
    setNewRoomName("");
    setRoomPassword("");
    setIsAddingRoom(false);
  };

  const handleJoinRoom = (room) => {
    if (room.isPrivate) {
      const password = prompt(`Введите пароль для комнаты "${room.name}":`);
      if (password !== room.password) {
        alert("Неверный пароль!");
        return;
      }
    }
    setCurrentRoom(room);
  };

  const handleAddProject = () => {
    if (!newProjectName.trim() || !currentRoom) return;
    const newProject = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      content: "",
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      isPinned: false,
      author: "Anonymous", // Static author name
      tags: [],
    };
    setProjects([...projects, newProject]);
    setNewProjectName("");
    setIsAddingProject(false);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleUpdateContent = (id, content) => {
    setProjects(
      projects.map((p) =>
        p.id === id
          ? { ...p, content: content || "", updatedAt: new Date().toLocaleString() }
          : p
      )
    );
  };

  const handlePin = (id) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p)));
  };

  const handleExportProject = (project) => {
    const blob = new Blob([`${project.name}\n\n${project.content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.name}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle password input (only digits)
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setRoomPassword(value);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="p-6 bg-gradient-to-r from-blue-500 to-teal-500 flex justify-between items-center flex-wrap gap-4 shadow-lg rounded-b-xl transition-all">
        <h1 className="text-3xl font-extrabold text-white">Заметки</h1>
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="input input-bordered pl-10 w-64 sm:w-80 md:w-96 rounded-xl focus:outline-none transition-all"
          />
        </motion.div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-6 bg-base-300 overflow-y-auto shadow-xl rounded-r-xl">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Комнаты</h2>
          <button
            className="btn btn-success mb-4 flex items-center w-full transition-all"
            onClick={() => setIsAddingRoom(true)}
          >
            <FaPlus className="mr-2" /> Новая комната
          </button>
          {isAddingRoom && (
            <motion.div
              className="mb-4 p-4 bg-base-100 rounded-lg shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Название комнаты"
                className="input input-bordered w-full mb-2"
              />
              <input
                value={roomPassword}
                onChange={handlePasswordChange}
                placeholder="Пароль (только цифры, опционально)"
                className="input input-bordered w-full mb-2"
                type="text"
              />
              <button
                className="btn btn-success w-full"
                onClick={handleCreateRoom}
              >
                Создать
              </button>
            </motion.div>
          )}
          <div className="space-y-4">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                className={`p-4 bg-base-200 rounded-lg flex justify-between items-center shadow-md hover:bg-base-300 transition-all ${
                  currentRoom?.id === room.id ? "border-l-4 border-blue-600" : ""
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <span
                  onClick={() => setCurrentRoom(room)}
                  className="cursor-pointer flex-1 truncate text-xl font-semibold"
                >
                  {room.name} {room.isPrivate && <FaLock className="inline ml-2 text-sm text-yellow-400" />}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleJoinRoom(room)}
                >
                  Войти
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-3/4 p-6 bg-base-200 overflow-y-auto">
          {!currentRoom ? (
            <p className="text-gray-500 text-center">Выберите комнату</p>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-bold">{`Заметки (${currentRoom.name})`}</h2>
                <motion.button
                  className="btn btn-success flex items-center"
                  onClick={() => setIsAddingProject(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus className="mr-2" /> Добавить
                </motion.button>
              </div>
              {isAddingProject && (
                <motion.div
                  className="mb-6 p-4 bg-base-100 rounded-lg shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Название заметки"
                    className="input input-bordered w-full mb-2"
                  />
                  <button className="btn btn-success w-full" onClick={handleAddProject}>
                    Сохранить
                  </button>
                </motion.div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    className={`p-4 bg-base-100 rounded-lg shadow-md transition-all ${
                      project.isPinned ? "border-l-4 border-blue-600" : ""
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <div className="flex gap-2">
                        <motion.button
                          className="text-gray-400 hover:text-yellow-400"
                          onClick={() => handlePin(project.id)}
                          whileHover={{ scale: 1.1 }}
                        >
                          <FaStar />
                        </motion.button>
                        <motion.button
                          className="text-gray-400 hover:text-red-400"
                          onClick={() => handleDeleteProject(project.id)}
                          whileHover={{ scale: 1.1 }}
                        >
                          <FaTrash />
                        </motion.button>
                        <motion.button
                          className="text-gray-400 hover:text-green-400"
                          onClick={() => handleExportProject(project)}
                          whileHover={{ scale: 1.1 }}
                        >
                          <FaDownload />
                        </motion.button>
                      </div>
                    </div>
                    <textarea
                      className="w-full h-32 p-2 mt-4 bg-base-200 rounded-md resize-none"
                      value={project.content}
                      onChange={(e) => handleUpdateContent(project.id, e.target.value)}
                      placeholder="Напишите заметку..."
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{project.updatedAt}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;