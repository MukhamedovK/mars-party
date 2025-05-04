import React from "react";
import { IoClose } from "react-icons/io5";

const ModalLikePublication = ({ isOpen, onClose, likes }) => {
  if (!isOpen) return null;
    console.log("LIKES: ", likes)
  return (
    <div className="modal modal-open">
      <div className="modal-box">
      <div className="flex items-center justify-between">
        <p className="font-bold text-lg">Likes</p>
        <button className="btn" onClick={onClose}>
        <IoClose />
        </button>
      </div>

      {/* Like List */}

      <div className="max-h-60 overflow-y-auto my-4 space-y-1">
        {likes?.length > 0 ? (
            likes.map((like, index) => (
                <div key={index} className="flex items-center">
                    <div className="flex items-center gap-2">
                    <div>
                        <img className="w-8 h-8 rounded-full" src={`${import.meta.env.VITE_APP_API_URL}${like?.userId?.profileImage}`}crossOrigin="anonymous" alt="image" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm text-base-content font-medium">{like?.userId?.username}</p>
                        <p className="text-xs text-base-content font-normal">{like?.userId?.firstName}</p>
                        <p className="text-xs text-base-content font-light">{new Date(like?.date).toLocaleDateString()}</p>
                    </div>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-center text-base-content">No likes yet</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default ModalLikePublication;