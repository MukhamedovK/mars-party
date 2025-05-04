import React, { useEffect } from "react";
import {
  followUser,
  getUserByUsername,
  unfollowUser,
} from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const { username } = useParams();
  const {
    userByUsername,
    followLoading,
    followError,
    user,
    token,
    refetchUsers,
    userByUsernameError,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserByUsername(username));
  }, [username, refetchUsers]);

  const handleFollow = () => {
    dispatch(
      followUser({ token, id: user?._id, followingId: userByUsername?._id })
    );
    if (followError) {
      toast.error("Error! Try again later");
    } else {
      toast.success("Followed!");
    }
  };

  const handleUnfollow = () => {
    dispatch(
      unfollowUser({ token, id: user?._id, followingId: userByUsername?._id })
    );
    if (followError) {
      toast.error("Error! Try again later");
    } else {
      toast.success("Unfollowed!");
    }
  };

  if (followLoading || !userByUsername) {
    return (
      <div className="rounded-box shadow-md w-full h-[80vh] flex items-center justify-center bg-base-300">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (userByUsernameError) {
    return (
      <div className="rounded-box shadow-md w-full h-[80vh] flex items-center justify-center bg-base-300">
        <p className="text-5xl">Profile Not Found</p>
      </div>
    );
  }

  return (
    <div className="bg-base-300 w-full max-h-[80vh] rounded-xl p-4">
      <div className="flex items-center justify-center gap-20">
        <div className="avatar">
          <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
  src={
    userByUsername?.profileImage
      ? `${import.meta.env.VITE_APP_API_URL}${userByUsername.profileImage}`
      : "https://placehold.co/150x150"
  }
  alt="Profile"
  crossOrigin="anonymous"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/150x150";
  }}
/>

          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">
                @{userByUsername?.username}
              </h2>
              <span className="badge badge-outline">
                {userByUsername?.grade}
              </span>
              {userByUsername && user?._id !== userByUsername?._id && (
                !userByUsername?.followers?.some(
                  (item) => item?._id === user?._id
                ) ? (
                  <button
                    className="btn btn-outline btn-primary rounded-xl"
                    onClick={handleFollow}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="btn btn-outline btn-error rounded-xl"
                    onClick={handleUnfollow}
                  >
                    Unfollow
                  </button>
                )
              )}
            </div>
            <p className="capitalize">
              {userByUsername?.firstName} {userByUsername?.lastName}
            </p>
            <div className="flex gap-4 mt-2">
              <div>
                <span className="font-bold">
                  {userByUsername?.publications?.length || 0}
                </span>{" "}
                publications
              </div>
              <div>
                <span className="font-bold">
                  {userByUsername?.followers?.length || 0}
                </span>{" "}
                followers
              </div>
              <div>
                <span className="font-bold">
                  {userByUsername?.following?.length || 0}
                </span>{" "}
                following
              </div>
            </div>
            <div className="mt-2 text-sm flex flex-col items-start justify-start">
              <p>📧 {userByUsername?.email}</p>
              <p>
                {userByUsername?.birthdate &&
                  "🎂 " + new Date(userByUsername.birthdate).toDateString()}
              </p>
            </div>
            <p className="text-sm mt-1">
              {userByUsername?.bio || "No bio yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
