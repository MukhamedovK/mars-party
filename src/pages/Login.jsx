import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbLock, TbLockOpen } from "react-icons/tb";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const [watch, setWatch] = useState(false);
  const [userData, setUserData] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const { status, error, isAuth } = useSelector((state) => state.user);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(userData));
    if (isAuth) {
      navigate("/");
      toast.success("Successfully logined!");
    } else {
      toast.error(error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-2/3 flex items-center justify-center">
        <img src="./task.png" className="object-cover" alt="Task Management" />
      </div>
      <div className="flex-1 flex flex-col bg-base-300 h-screen rounded-l-3xl p-5 justify-center">
        <h1 className="text-2xl font-medium">Welcome to Mars</h1>
        <p className="text-3xl font-black text-primary">
          Task Management System
        </p>
        <form
          className="w-full flex flex-col gap-1 my-10"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div>
            <label className="input validator w-full">
              <input
                type="text"
                required
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={userData.username}
              />
            </label>
          </div>
          <div>
            <label className="input validator w-full">
              <input
                type={watch ? "text" : "password"}
                required
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={userData.password}
              />
              <button type="button" onClick={() => setWatch(!watch)}>
                {watch ? <TbLock /> : <TbLockOpen />}
              </button>
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="text-center mt-10 text-primary">
          <Link to="/forgot">Forgot Password?</Link>
          <p className="mt-3 text-secondary">
            Don't have an account?{" "}
            <Link to="/register" className="underline text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
