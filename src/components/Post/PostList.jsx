import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../socket";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.user?.user?._id);
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    if (!userId) return;

    socket.emit("get-following", userId);

    const handleFollowings = (followings) => {
      console.log('Received followings:', followings); 
      setUsers(
        followings.map((user) => ({ ...user, status: user.status || "offline" }))
      );
      setLoading(false);
    };

    const handleError = () => {
      setUsers([]);
      setLoading(false);
    };

    socket.on("send-following", handleFollowings);
    socket.on("error", handleError);

    return () => {
      socket.off("send-following", handleFollowings);
      socket.off("error", handleError);
    };
  }, [userId]);

  useEffect(() => {
    const updateUserStatus = ({ userId, status }) => {
      console.log('Updating status:', userId, status);  
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? { ...user, status } : user))
      );
    };

    socket.on("user-status-updated", updateUserStatus);
    return () => socket.off("user-status-updated", updateUserStatus);
  }, []);

  return (
    <div className="bg-base-300 rounded-xl h-full w-full p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Friends List</h2>
      <div className="grid grid-cols-1 gap-3">
        {loading
          ? Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2 bg-base-100 p-3 rounded-xl">
                <div className="skeleton w-12 h-12 rounded-full"></div>
                <div className="flex flex-col">
                  <div className="skeleton h-3 w-28 mb-2"></div>
                  <div className="skeleton h-2 w-20"></div>
                </div>
              </div>
            ))
          : users.length > 0
          ? users.map((user) => (
              <div key={user._id} className="flex items-center gap-2 bg-base-100 p-3 rounded-xl">
                <div className={`avatar ${user.status === "online" ? "avatar-online" : "avatar-offline"}`}>
                  <div className="w-12 rounded-full">
                    {user.profileImage && (
                      <img
                        src={`${apiUrl}${user.profileImage}`}
                        alt={user.username || "User"}
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{user.username || "Unknown"}</p>
                  <p className="text-sm text-neutral capitalize">{user.grade || "User"}</p>
                  <p className={`text-xs ${user.status === "online" ? "text-green-500" : "text-gray-500"}`}>
                    {user.status === "online" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))
          : <p className="text-center text-gray-500">No friends found.</p>}
      </div>
    </div>
  );
};

export default UserList;
