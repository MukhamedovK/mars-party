import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import ChatInput from "../components/Chat/ChatInput";
import { useParams } from "react-router-dom";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([false]);
  const { user } = useSelector((state) => state.user);
  const { roomId } = useParams();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages([false])
    socket.emit("join-room", roomId);
    socket.emit("get-room-messages", roomId);

    socket.on("room-messages", (data) => {
      setMessages(data || []);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          text: data?.message,
          sender: data?.sender || { username: "Anonymous" },
          createdAt: data?.timestamp,
        },
      ]);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error.message);
      toast.error(error.message);
    });

    return () => {
      socket.off("room-messages");
      socket.off("receive-message");
      socket.off("error");
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    socket.emit("send-message", {
      roomId,
      message: message.trim(),
      sender: user?._id,
    });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-[80vh] w-full rounded-lg dark:bg-base-200 bg-gradient-to-br via-warning">
      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-y-2">
        {messages[0] === false ? (
          <div className="h-full w-full flex items-center justify-center">
            <span className="loading loading-spinner bg-black loading-xl"></span>
          </div>
        ) : messages.length > 0 ? (
          messages.map((item, id) => (
            <div
              className={`chat ${
                item?.sender?._id === user?._id ? "chat-end" : "chat-start"
              }`}
              key={id}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Avatar"
                    src={`${import.meta.env.VITE_APP_API_URL}${
                      item?.sender?.profileImage
                    }`}
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              <div className="chat-header text-black">
                {item?.sender?.username}
                <time className="text-xs text-black">
                  {formatTimestamp(item?.createdAt)}
                </time>
              </div>
              <div className="chat-bubble break-words">{item?.text}</div>
            </div>
          ))
        ) : (
          <p className="h-full uppercase w-full flex items-center justify-center text-4xl">
            Messages Not Found. Start you!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full">
        <ChatInput
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default Chat;
