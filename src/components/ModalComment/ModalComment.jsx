import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
const ModalComment = ({ isOpen, onClose, comments, onAddComment }) => {
    const [newComment, setNewComment] = useState("");
    console.log("COMMENTS: ", comments)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            const success = await onAddComment(newComment);
            if (success) {
                setNewComment("");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <div className="flex items-center justify-between">
                    <p className="font-bold text-lg">Comments</p>
                    <button className="btn" onClick={onClose}>
                        <IoClose />
                    </button>
                </div>
                {/* Comments List */}
                <div className="max-h-60 overflow-y-auto my-4">
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div>
                                    {/* <img className="w-8 h-8 rounded-full" src={`${import.meta.env.VITE_APP_API_URL}${comment?.userId.profileImage}`} crossOrigin="anonymous" alt="" /> */}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold">{comment?.userId?.username}</p>
                                    <p className="text-xs font-medium">{comment.text}</p>
                                    <p className="text-xs font-light">{new Date(comment.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-base-content">No comments yet</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="input input-bordered flex-1"
                    />
                    <button type="submit" className="text text-primary">
                        <AiOutlineSend className="size-6 hover:text-base-content" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalComment;