import React, { useState, useEffect } from "react";
import { IoAddCircleSharp, IoExitOutline, IoNotifications } from "react-icons/io5";
import { RiAddCircleLine } from "react-icons/ri";
import { ImSearch } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ModalContainer from "./ModalContainer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/authSlice";

// Custom CSS for Swiper
const swiperStyles = `
  .swiper-container {
    width: 100%;
    max-width: 800px;
    overflow: hidden;
    position: relative;
    min-height: 60px;
  }
  .swiper-slide {
    width: 60px !important;
    height: 60px !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .swiper-button-next,
  .swiper-button-prev {
    color: #3b82f6;
    width: 30px !important;
    height: 30px !important;
    top: 75% !important;
    transform: translateY(-50%) !important;
    margin-top: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 16px !important;
  }
`;

const Navbar = () => {
  const [stories, setStories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch stories from the backend on component mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("https://backend-mars-hub.onrender.com/api/v1/reels", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data && Array.isArray(data)) {
          const mappedStories = await Promise.all(
            data.map(async (story) => {
              let avatarUrl = "https://placehold.co/150x150";
              let mediaUrl = "https://placehold.co/600x400?text=No+Media";
              if (story.author) {
                const profileImage = story.author.profileImage.startsWith("http")
                  ? story.author.profileImage
                  : `https://backend-mars-hub.onrender.com${story.author.profileImage}`;
                try {
                  const imageResponse = await fetch(profileImage, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  if (imageResponse.ok) {
                    const blob = await imageResponse.blob();
                    avatarUrl = URL.createObjectURL(blob);
                  } else {
                    console.error(`Failed to load avatar for ${story.author.username}: ${imageResponse.status}`);
                  }
                } catch (error) {
                  console.error(`Error fetching avatar for ${story.author.username}:`, error);
                }
              }

              // Fetch the media as a blob
              try {
                const mediaResponse = await fetch(story.media, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                if (mediaResponse.ok) {
                  const blob = await mediaResponse.blob();
                  mediaUrl = URL.createObjectURL(blob);
                } else {
                  console.error(`Failed to load media for story ${story._id}: ${mediaResponse.status}`);
                }
              } catch (error) {
                console.error(`Error fetching media for story ${story._id}:`, error);
              }

              return {
                id: story._id,
                author: story.author
                  ? {
                      name: story.author.username,
                      avatar: avatarUrl,
                    }
                  : {
                      name: "Unknown",
                      avatar: "https://placehold.co/150x150",
                    },
                publicationDate: story.createdAt,
                description: story.description || "No description available",
                hashtags: story.hashtags || [],
                comments: story.comments?.length || 0,
                likes: story.likes?.length || 0,
                status: story.isPublic ? "active" : "inactive",
                stories: [
                  {
                    thumbnail: mediaUrl,
                    video: story.type === "video" ? mediaUrl : null,
                  },
                ],
              };
            })
          );
          setStories(mappedStories);
        } else {
          console.error("Unexpected response format:", data);
          toast.error("Failed to load stories");
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        toast.error("Error fetching stories");
      }
    };

    if (token) {
      fetchStories();
    }
  }, [token]);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const logoutHandler = async () => {
    dispatch(logout());
    navigate("/login");
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: Не удалось загрузить профиль`);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
      toast.error("Не удалось загрузить данные пользователя");
      return null;
    }
  };

  return (
    <div className="w-full drop-shadow-md p-2 mb-2 relative z-[200] rounded-xl bg-base-100">
      <style>{swiperStyles}</style>
      <div className="container mx-auto max-w-[95%] gap-10 relative z-50 flex items-center justify-between">
        <div className="w-2/3 flex-1 relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={8}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="swiper-container"
          >
            {stories.length > 0 ? (
              stories.map((story) => (
                <SwiperSlide key={story.id} className="p-2">
                  <div className="avatar" onClick={() => openModal(story)}>
                    <div className="ring-primary ring-offset-base-100 w-12 h-12 rounded-full ring ring-offset-2 cursor-pointer">
                      <img
                       src={`https://backend-mars-hub.onrender.com${user.profileImage}`}
                       alt={user.username || "User"}
                       crossOrigin="anonymous"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          if (e.target.src !== "https://placehold.co/150x150") {
                            console.error(`Failed to load image: ${e.target.src}`);
                            e.target.src = "https://placehold.co/150x150";
                          }
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="text-center text-gray-500"></div>
              </SwiperSlide>
            )}
          </Swiper>
          <div className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10"></div>
          <div className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10"></div>
        </div>

        <div className="flex items-center gap-5">
          <Link to="/search-users" className="text-xl mt-2">
            <ImSearch />
          </Link>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="text-xl mt-2">
              <RiAddCircleLine />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <Link to="/addStories">Add Stories</Link>
              </li>
              <li>
                <Link to="/addPublication">Add Publication</Link>
              </li>
            </ul>
          </div>

        
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              onChange={(e) =>
                document.documentElement.setAttribute(
                  "data-theme",
                  e.target.checked ? "dark" : "light"
                )
              }
            />
            <svg
              className="swap-off fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </g>
            </svg>
            <svg
              className="swap-on fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </g>
            </svg>
          </label>

          <div className="dropdown dropdown-end z-50">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src={`https://backend-mars-hub.onrender.com${user.profileImage}`}
                   crossOrigin="anonymous"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow text-xl"
            >
              <li>
                <Link to={`/profile/${user?.username}`} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li onClick={() => logoutHandler()}>
                <p className="text-error flex items-center justify-between font-medium">
                  <span>Logout</span>
                  <span className="text-lg">
                    <IoExitOutline />
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ModalContainer
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Navbar;