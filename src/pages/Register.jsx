import React, { useEffect, useState } from 'react';
import { IoChevronBackOutline } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: "",
    email: "",
    password: ""
  });

  const handleInputChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const requestRegister = async () => {
    console.log("Register:", user)
    try {
      const request = await fetch('http://localhost:5000/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      if (!request.ok) {
        throw new Error('Failed to register user');
      }
      const data = await request.json();
      console.log(data);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/')
      toast.success("Welcome to the app!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to register user. Please try again.");
    } finally {
      setUser({ firstName: '', lastName: '', email: '', password: '' });
    }
  }

  return (
    <div className='flex flex-col md:flex-row w-[90%]'>
      <div className='bg-base-300 hidden md:flex'>
        <div>
          <img
            src="https://global-tech.me/wp-content/uploads/2021/08/Just-iD-Register-02.webp"
            alt="Registration"
            className='object-cover rounded-lg shadow-xl'
          />
        </div>
      </div>

      <div className='p-5'>
        <Link to="/login">
          <IoChevronBackOutline size={40} className='border border-primary p-2 text-white rounded-full items-center' />
        </Link>
      </div>

      <div className='flex p-8 items-center m-auto '>
        <div className='justify-center'>
          <div className='flex gap-10 justify-center'>
            <p className='text-3xl font-medium text-base-content'>
              Sign up <span className='text-warning underline'> To Do List</span>
            </p>
          </div>

          <div className=' p-10 m-auto flex flex-col gap-10'>
            <div className='flex gap-12'>
              <div className='flex flex-col'>
                <label htmlFor='name' className='font-bold'>First Name</label>
                <input type="text" name='firstName' value={user.firstName} onChange={(e) => handleInputChange(e)} className="input input-primary w-[120%] h-13 top-2" placeholder='Create your Name' />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='username' className='font-bold'>Last Name</label>
                <input type="text" name='lastName' value={user.lastName} onChange={(e) => handleInputChange(e)} className="input input-primary w-[120%] h-13 top-2" placeholder='Create your Last Name' />
              </div>
            </div>

            <div className='mt-4'>
              <label htmlFor="email" className='font-bold'>
                Email
              </label>
              <input type="text" name='email' value={user.email} onChange={(e) => handleInputChange(e)} className='input input-primary w-[109%] h-13 mt-2' placeholder='Create your email' />
            </div>

            <div className='relative'>
              <label htmlFor="password" className='font-bold'>
                Password
              </label>
              <div className='relative w-[109%]'>
                <input
                  type={showPassword ? "text" : "password"}
                  name='password'
                  value={user.password}
                  onChange={(e) => handleInputChange(e)}
                  className='input input-primary w-full h-13 mt-2 pr-10'
                  placeholder='Create your password'
                />
                <button
                  type="button"
                  className='absolute right-3 top-6 '
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                </button>
              </div>
            </div>

            <div className='justify-center flex'>
              <button onClick={() => requestRegister()} className='btn btn-primary hover:btn-warning duration-150 w-full relative left-4 h-12 rounded-xl'>
                Create account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;