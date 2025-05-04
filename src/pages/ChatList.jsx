import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsFillChatRightDotsFill } from "react-icons/bs";
import customFetch from "../hooks/customAxios";

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleOpenChat = (companionId) => {
    const roomId = `${companionId}-${user?._id}`;
    navigate(`/chat/${roomId}`);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await customFetch("/api/v1/messangers");
        const newData = response.data.filter(
          (item) => item?.user1?._id !== user?._id && item?.user2?._id === user?._id
        );

        setRooms(newData);
      } catch (error) {
        console.log(error);
        toast.error("Cannot fetch rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="rounded-box shadow-md w-full h-[80vh] flex items-center justify-center bg-base-300">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <ul className="list rounded-box shadow-md w-full bg-base-300">
      <li className="p-4 pb-2 text-lg opacity-60 tracking-wide">
        Chats With Strangers
      </li>

      {rooms.length > 0 ? (
        rooms.map((item, key) => (
          <li
            className="px-10 list-row border-y flex items-center justify-between"
            key={key}
          >
            <div className="flex gap-6 items-center">
              <Link
                className="cursor-pointer"
                to={`/profile/${item?.user1?.username}`}
              >
                <div>
                  <img
                    className="size-10 rounded-full"
                    src={`${import.meta.env.VITE_APP_API_URL}${
                      item?.user1?.profileImage
                    }`}
                    crossOrigin="anonymous"
                  />
                </div>
              </Link>
              <div>
                <div>
                  {item?.user1?.firstName && item?.user1?.firstName}{" "}
                  {item?.user1?.lastName && item?.user1?.lastName}
                </div>
                <div className="text-xs font-semibold opacity-60">
                  {item?.user1?.username && item?.user1?.username}
                </div>
              </div>
            </div>
            <BsFillChatRightDotsFill
              className="cursor-pointer text-3xl mr-3"
              onClick={() => handleOpenChat(item?.user1?._id)}
            />
          </li>
        ))
      ) : (
        <p className="h-full w-full uppercase flex items-center justify-center text-4xl">
          Not Found
        </p>
      )}
    </ul>
  );
};

export default ChatList;
