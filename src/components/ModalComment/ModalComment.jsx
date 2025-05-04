import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const ModalComment = ({ isOpen, onClose, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Izoh matni bo‘sh bo‘lmasligi kerak!");
      return;
    }

    setIsCommenting(true);
    const success = await onAddComment(newComment);
    if (success) {
      setNewComment("");
    }
    setIsCommenting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">Izohlar</p>
          <button className="btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        {/* Comments List */}
        <div className="max-h-60 overflow-y-auto my-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment?._id} className="flex items-center gap-2 mb-2">
                <div>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={`${import.meta.env.VITE_APP_API_URL}${
                      comment?.userId?.profileImage || "/default.jpg"
                    }`}
                    crossOrigin="anonymous"
                    alt={comment?.userId?.username || "User"}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold">
                    {comment?.userId?.username || "User"}
                  </p>
                  <p className="text-xs font-medium">{comment?.text}</p>
                  <p className="text-xs font-light">
                    {new Date(comment?.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-base-content">Hozircha izohlar yo‘q</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Izoh yozing..."
            className="input input-bordered flex-1"
            disabled={isCommenting}
          />
          <button
            type="submit"
            className="text text-primary"
            disabled={isCommenting}
          >
            <AiOutlineSend
              className={`size-6 ${isCommenting ? "opacity-50" : "hover:text-base-content"}`}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalComment;