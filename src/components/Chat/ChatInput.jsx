import React, { useState } from "react";
import { IoSend } from "react-icons/io5";

const ChatInput = ({ setMessage, handleSendMessage }) => {
  const [input, setInput] = useState("");
  return (
    <div className="join w-full">
      <input
        type="text"
        className="input w-full bg-base-200 outline-none border-none focus:outline-none rounded-bl-md"
        placeholder="Write here..."
        value={input}
        onChange={(e) => {
          setMessage(e.target.value);
          setInput(e.target.value);
        }}
        required
      />
      <button
        className="btn btn-primary rounded-br-lg"
        disabled={!input.trim()}
        onClick={() => {
          handleSendMessage();
          setMessage("")
          setInput("")
        }}
      >
        <IoSend color="white" />
      </button>
    </div>
  );
};

export default ChatInput;
