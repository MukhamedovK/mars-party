import React, { useEffect, useState } from "react";
import { IoClose, IoHeartOutline, IoHeart, IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";

const ModalContainer = ({ user, isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(user?.likes || 0);
  const [commentsCount, setCommentsCount] = useState(user?.comments || 0);
  const [comment, setComment] = useState("");
  const token = useSelector((state) => state.user.token);

  // Handle the progress bar animation (3 seconds)
  useEffect(() => {
    let interval;
    if (isOpen) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + (100 / (3000 / 16));
        });
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle modal open/close and auto-close timer
  useEffect(() => {
    if (isOpen) {
      const modal = document.getElementById("my_modal_4");
      if (modal) {
        modal.showModal();
        const timer = setTimeout(() => {
          modal.close();
          onClose();
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, onClose]);

  // Determine if the story is a video or image
  const isVideo = user?.stories?.[0]?.video && user.stories[0].video !== null;
  const mediaSource = isVideo ? user.stories[0].video : user.stories[0]?.thumbnail;

  // Parse hashtags
  const parsedHashtags = Array.isArray(user?.hashtags)
    ? user.hashtags.flatMap((tag) => {
        try {
          const parsed = JSON.parse(tag);
          return Array.isArray(parsed) ? parsed : [tag];
        } catch {
          return [tag];
        }
      })
    : [];

  // Handle like/unlike action
  const handleLike = async () => {
    try {
      const method = liked ? "DELETE" : "POST";
      const response = await fetch(`https://backend-mars-hub.onrender.com/api/v1/reels/${user.id}/like`, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedStory = await response.json();
        setLiked(!liked);
        setLikesCount(updatedStory.likes?.length || 0);
      } else {
        console.error(`Failed to ${liked ? "unlike" : "like"} story: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error ${liked ? "unliking" : "liking"} story:`, error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await fetch(`https://backend-mars-hub.onrender.com/api/v1/reels/${user.id}/comment`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      if (response.ok) {
        const updatedStory = await response.json();
        setCommentsCount(updatedStory.comments?.length || 0);
        setComment("");
      } else {
        console.error(`Failed to add comment: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <dialog id="my_modal_4" className="modal">
      {/* Semi-transparent backdrop to make background visible */}
      <div className="fixed inset-0 bg-opacity-50"></div>

      <div className="modal-box w-[40%] max-w-[400px] h-[80%] p-0 flex flex-col mx-auto rounded-lg">
        {/* Progress Bar */}
        <div className="absolute top-2 left-2 right-2 flex space-x-1 z-50">
          <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-16"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <button className="text-white text-2xl" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        {/* Main Content */}
        <div className="relative flex-1 flex flex-col justify-center items-center">
          {/* Media (Image or Video) */}
          <div className="absolute inset-0 flex justify-center items-center">
            {isVideo ? (
              <video
                src={mediaSource}
                className="w-full h-full object-contain rounded-t-lg"
                autoPlay
                loop
                muted
                playsInline
                onError={(e) => {
                  console.error(`Failed to load video: ${mediaSource}`);
                  e.target.poster = "https://placehold.co/600x400?text=Video+Failed+to+Load";
                }}
              />
            ) : (
              <img
                src={mediaSource || "https://placehold.co/600x400?text=No+Media"}
                className="w-full h-full object-contain rounded-t-lg"
                alt={user?.author?.name || "Story Media"}
                onError={(e) => {
                  if (e.target.src !== "https://placehold.co/600x400?text=No+Media") {
                    console.error(`Failed to load image: ${mediaSource}`);
                    e.target.src = "https://placehold.co/600x400?text=No+Media";
                  }
                }}
              />
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                  <img
                    src={user?.author?.avatar || "https://placehold.co/150x150"}
                    alt={user?.author?.name || "Unknown"}
                    className="w-full h-full rounded-full object-cover border-2 border-black"
                    onError={(e) => {
                      if (e.target.src !== "https://placehold.co/150x150") {
                        console.error(`Failed to load avatar: ${user?.author?.avatar}`);
                        e.target.src = "https://placehold.co/150x150";
                      }
                    }}
                  />
                </div>
              </div>
              <p className="text-white text-xs font-semibold">{user?.author?.name || "Unknown"}</p>
              <p className="text-gray-300 text-[10px]">
                {user?.publicationDate ? new Date(user.publicationDate).toLocaleTimeString() : ""}
              </p>
            </div>

            <p className="text-white text-xs">{user?.description || "No description available"}</p>

            {/* Hashtags */}
            {parsedHashtags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {parsedHashtags.map((tag, index) => (
                  <span key={index} className="text-blue-300 text-[10px] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Like Button */}
            <div className="mt-2 flex items-center gap-2">
              <button onClick={handleLike} className="text-white text-xl">
                {liked ? <IoHeart className="text-red-500" /> : <IoHeartOutline />}
              </button>
              <span className="text-white text-xs">{likesCount} likes</span>
            </div>
          </div>

          {/* Swipe Up / Tap to Show Details */}
          <div
            className="absolute bottom-20 left-0 right-0 text-center cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            <p className="text-white text-xs animate-bounce">
              {showDetails ? "Hide Details" : "See More"}
            </p>
            <svg
              className={`w-5 h-5 mx-auto text-white transform ${showDetails ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="p-3 bg-black/50 flex items-center gap-2 rounded-b-lg">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent border border-gray-500 rounded-full px-3 py-1 text-white text-xs focus:outline-none"
          />
          <button
            onClick={handleCommentSubmit}
            className="text-white text-lg"
            disabled={!comment.trim()}
          >
            <IoSend className={comment.trim() ? "text-blue-500" : "text-gray-500"} />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalContainer;