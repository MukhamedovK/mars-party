import React, { useEffect, useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { LuSend } from "react-icons/lu";
import { FiBookmark } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import ModalComment from "../components/ModalComment/ModalComment";
import ModalLikePublication from "../components/ModalLikePublication/ModalLikePublication";
import "swiper/css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [isModalCommentOpen, setIsModalCommentOpen] = useState(false);
  // const [isModalLikeOpen, setIsModalLikeOpen] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState(null);

  const { user, token } = useSelector((state) => state?.user);

  const getAllPublications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backend-mars-hub.onrender.com/api/v1/publications?page=${page}&sort=-createdAt`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }

      const data = await response.json();
      console.log("CHECK Publications: ", data);
      setPublications(data?.data?.publications || []);
      setTotalPages(data?.pages || 0);
    } catch (err) {
      console.error("Get publications error:", err);
      toast.error("Publikatsiyalarni olishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const handleLikePublication = async (publicationId) => {
    const previousPublications = [...publications];
    const publication = publications.find((pub) => pub?._id === publicationId);
    const isLiked = publication?.likes?.some(
      (like) => like.userId?._id === user?._id
    );

    const newLike = {
      userId: {
        _id: user?._id,
        username: user?.username ,
        firstName: user?.firstName,
        profileImage: user?.profileImage
      },
      date: new Date().toISOString(),
    };


    setPublications((prev) =>
      prev.map((pub) =>
        pub?._id === publicationId
          ? {
              ...pub,
              likes: isLiked
                ? pub.likes.filter((like) => like.userId?._id !== user?._id)
                : [...pub.likes, newLike],
            }
          : pub
      )
    );

    try {
      const response = await fetch(
        `https://backend-mars-hub.onrender.com/api/v1/publications/${publicationId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user?._id }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setPublications(previousPublications);
        throw new Error(responseData.message || "Like qilishda xatolik!");
      }

      let serverLikes = responseData.data?.likes || [];


      if (!isLiked && !serverLikes.some((like) => like.userId?._id === user?._id)) {
        serverLikes = [...serverLikes, newLike];
      }
      else if (isLiked && serverLikes.some((like) => like.userId?._id === user?._id)) {
        serverLikes = serverLikes.filter((like) => like.userId?._id !== user?._id);
      }

      setPublications((prev) =>
        prev.map((pub) =>
          pub?._id === publicationId
            ? {
                ...pub,
                likes: serverLikes,
              }
            : pub
        )
      );


    } catch (err) {
      setPublications(previousPublications);
      console.error("Like error:", err);
      toast.error("Like qilishda xatolik: " + err.message);
    }
  };

  const handleDeletePublication = async (publicationId) => {
    const publication = publications.find((p) => p?._id === publicationId);
    if (publication?.author?._id !== user?._id) {
      return toast.error("Siz bu publikatsiyani joylashtirmagansiz!");
    }

    try {
      const response = await fetch(
        `https://backend-mars-hub.onrender.com/api/v1/publications/delete/${publicationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete publication");
      }

      setPublications((prev) =>
        prev.filter((pub) => pub?._id !== publicationId)
      );
      toast.success("Publikatsiya o‘chirildi!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("O‘chirishda xatolik: " + err.message);
    }
  };

  const handleEditPublication = async (publicationId) => {
    const publication = publications.find((p) => p?._id === publicationId);
    if (publication?.author?._id !== user?._id) {
      return toast.error("Siz bu publikatsiyani joylashtirmagansiz!");
    }

    try {
      const formData = new FormData();
      formData.append("description", editDescription);

      const response = await fetch(
        `https://backend-mars-hub.onrender.com/api/v1/publications/edit/${publicationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit publication");
      }

      setPublications((prev) =>
        prev.map((pub) =>
          pub?._id === publicationId
            ? { ...pub, description: editDescription }
            : pub
        )
      );
      setEditingId(null);
      toast.success("Tahrir muvaffaqiyatli saqlandi!");
    } catch (err) {
      console.error("Edit error:", err.message);
      toast.error("Tahrir xatolik: " + err.message);
    }
  };

  const handleAddComment = async (publicationId, commentText) => {
    const tempCommentId = `temp-${Date.now()}`;
    const tempComment = {
      _id: tempCommentId,
      text: commentText,
      userId: {
        _id: user?._id,
        username: user?.username || "User",
        profileImage: user?.profileImage || "/default.jpg",
      },
      date: new Date().toISOString(),
    };

    setPublications((prev) =>
      prev.map((pub) =>
        pub._id === publicationId
          ? { ...pub, comments: [...pub.comments, tempComment] }
          : pub
      )
    );

    try {
      const response = await fetch(
        `https://backend-mars-hub.onrender.com/api/v1/publications/${publicationId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: commentText,
            userId: user?._id,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message || "Izoh qo'shishda xatolik!");
        return true;
      }

      const newComment = responseData.data || responseData;
      setPublications((prev) =>
        prev.map((pub) =>
          pub._id === publicationId
            ? {
                ...pub,
                comments: [
                  ...pub.comments.filter((c) => c._id !== tempCommentId),
                  {
                    _id: newComment._id || newComment.id || tempCommentId,
                    text: newComment.text || commentText,
                    userId: {
                      _id:
                        newComment.userId?._id ||
                        newComment.user?._id ||
                        user?._id,
                      username:
                        newComment.userId?.username ||
                        newComment.user?.username ||
                        user?.username || "User",
                      profileImage:
                        newComment.userId?.profileImage ||
                        newComment.user?.profileImage ||
                        user?.profileImage || "/default.jpg",
                    },
                    date: newComment.date || new Date().toISOString(),
                  },
                ],
              }
            : pub
        )
      );

      return true;
    } catch (err) {
      console.error("Comment error:", err);
      toast.error("Izoh qo‘shishda xatolik: " + err.message);
      return true;
    }
  };

  const startEditing = (publication) => {
    setEditingId(publication?._id);
    setEditDescription(publication?.description || "");
  };

  const openCommentModal = (publicationId) => {
    setSelectedPublicationId(publicationId);
    setIsModalCommentOpen(true);
  };

  // const openLikeModal = (publicationId) => {
  //   setSelectedPublicationId(publicationId);
  //   setIsModalLikeOpen(true);
  // };

  useEffect(() => {
    if (token) {
      getAllPublications();
    }
  }, [token, page]);

  return (
    <div className="flex flex-col gap-5 flex-1 h-full w-full p-5 rounded-xl bg-base-300">
      <div className="max-h-[76vh] p-2 gap-y-5 overflow-y-auto">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="flex items-center justify-between my-4">
                <div className="flex gap-2 items-center">
                  <div className="skeleton w-10 h-10 rounded-full"></div>
                  <div className="flex flex-col gap-2">
                    <div className="skeleton w-24 h-2"></div>
                    <div className="skeleton w-24 h-2"></div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="skeleton w-2 h-2"></div>
                  <div className="skeleton w-2 h-2"></div>
                  <div className="skeleton w-2 h-2"></div>
                </div>
              </div>
              <div className="skeleton h-36 sm:h-44 md:h-52 lg:h-80 w-full"></div>
              <div className="flex gap-1 mb-8">
                <div className="skeleton w-12 h-7"></div>
                <div className="skeleton w-12 h-7"></div>
                <div className="skeleton w-12 h-7"></div>
              </div>
            </div>
          ))
        ) : publications.length > 0 ? (
          publications.map((item) => (
            <div key={item?._id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <img
                    src={`${import.meta.env.VITE_APP_API_URL}${
                      item?.author?.profileImage || "/default.jpg"
                    }`}
                    className="rounded-full w-8 h-8"
                    alt={
                      typeof item?.author === "string" ? item?.author : "User"
                    }
                    crossOrigin="anonymous"
                  />
                  <p className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {item?.author?.username || "name"}
                    </span>
                  </p>
                </div>
                {user?._id === item?.author?._id && (
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="text-md">
                      <FaEllipsis />
                    </div>
                    <ul className="dropdown-content menu bg-base-100 gap-2 rounded-md w-32">
                      <button
                        className="flex items-center gap-1 text-xs font-medium text-base-content"
                        onClick={() => startEditing(item)}
                      >
                        <MdEdit /> Tahrirlash
                      </button>
                      <button
                        className="flex items-center gap-1 text-xs font-medium text-error"
                        onClick={() => handleDeletePublication(item?._id)}
                      >
                        <RiDeleteBin6Line /> O‘chirish
                      </button>
                    </ul>
                  </div>
                )}
              </div>

              {item?.content && item?.content[0] && (
                <div className="h-36 sm:h-44 md:h-52 lg:h-80 w-full">
                  {item?.content[0]?.type === "image" ? (
                    <img
                      src={`https://backend-mars-hub.onrender.com${item?.content[0]?.url}`}
                      className="w-full h-full rounded-md object-cover"
                      alt={item?.content[0]?.author}
                      crossOrigin="anonymous"
                    />
                  ) : item.content[0].type === "video" ? (
                    <video
                      controls
                      className="w-full h-full rounded-md object-cover"
                      src={`https://backend-mars-hub.onrender.com${item?.content[0]?.url}`}
                      crossOrigin="anonymous"
                    />
                  ) : null}
                </div>
              )}

              {item?.description && (
                <div className="mt-2">
                  {editingId === item._id ? (
                    <div className="flex items-center gap-2">
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="textarea textarea-bordered w-full text-sm"
                        placeholder="Tavsifni tahrirlash..."
                      />
                      <button
                        className="btn btn-sm btn-primary h-20"
                        onClick={() => handleEditPublication(item?._id)}
                      >
                        <FaCheck />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-base-content">
                      {item?.description}
                    </p>
                  )}
                </div>
              )}

              {item?.views?.length > 0 && (
                <p className="flex items-center gap-1 text-xs">
                  <MdOutlineRemoveRedEye />
                  {item?.views?.length}
                </p>
              )}
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <button
                      className="flex items-center"
                      onClick={() => handleLikePublication(item?._id)}
                    >
                      {item?.likes?.some(
                        (like) => like.userId?._id === user?._id
                      ) ? (
                        <FaHeart className="text-red-500 cursor-pointer" />
                      ) : (
                        <FaRegHeart className="text-base-content cursor-pointer" />
                      )}
                    </button>
                    {item?.likes?.length > 0 && (
                      <span
                        className="text-xs "
                        // onClick={() => openLikeModal(item?._id)}
                      >
                        {item.likes.length}
                      </span>
                    )}
                  </div>

                  <button
                    className="flex items-center gap-1"
                    onClick={() => openCommentModal(item?._id)}
                  >
                    <FiMessageCircle className="text-md cursor-pointer" />
                    {item?.comments?.length > 0 && (
                      <span className="text-xs">{item?.comments?.length}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center text-base-content h-screen text-2xl">
            Hozircha publikatsiyalar yo‘q
          </div>
        )}
      </div>
      {/* {selectedPublicationId && (
        <ModalLikePublication
          isOpen={isModalLikeOpen}
          onClose={() => {
            setIsModalLikeOpen(false);
            setSelectedPublicationId(null);
          }}
          likes={
            publications.find((pub) => pub?._id === selectedPublicationId)
              ?.likes || []
          }
        />
      )} */}
      {selectedPublicationId && (
        <ModalComment
          isOpen={isModalCommentOpen}
          onClose={() => {
            setIsModalCommentOpen(false);
            setSelectedPublicationId(null);
          }}
          comments={
            publications.find((pub) => pub?._id === selectedPublicationId)
              ?.comments || []
          }
          onAddComment={(commentText) =>
            handleAddComment(selectedPublicationId, commentText)
          }
        />
      )}
    </div>
  );
};

export default Home;