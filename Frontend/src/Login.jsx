import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import './App.css';
import { useDispatch } from 'react-redux';
import { loginAdmin } from './Redux/adminSlice';
import { useSelector } from 'react-redux';

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); 
  const adminState = useSelector((state) => state.admin); // ✅ Access Redux state
  const token = localStorage.getItem('token');

  const dispatch = useDispatch()

  useEffect(() => {
    if (token) {
      navigate('/home');
    }else{
      navigate('/')
    }
  }, [token]); 

  const loginadmins = async (e) => {
    e.preventDefault();
    const { email, password } = data;
  
    try {
      const response = await axios.post('http://localhost:5000/loginadmins', { email, password });
  
      if (response.data.error) {
        console.log(response.data.error);
        alert(response.data.error); // Show error message if returned by API
      } else if (response.data.token) {
        dispatch(loginAdmin({ admin: response.data.admin, token: response.data.token }));
        localStorage.setItem('token', response.data.token);
        console.log("Success");
        navigate('/home'); // ✅ Redirect after successful login
      }
    } catch (error) {  
      if (error.response && error.response.status === 403) {
           navigate('/home/adminsuspended')
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Left Side - Login Form */}
    <div className="w-full md:w-1/2 flex items-center justify-center p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to access your account
        </p>
        <form onSubmit={loginadmins}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>

    {/* Right Side - Image Section */}
    <div className="w-1/2 hidden md:flex items-center justify-center bg-blue-500">
      <img
        src="https://imgs.search.brave.com/AnJsDxgrQpq8OjvLnjQHkiUlBjwgUBQa8l10M77fEhY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzcwLzM0LzIy/LzM2MF9GXzE3MDM0/MjIzNV9MVUQ2am5E/VE9ZSWMyTWprS1BC/cmx3SThvOURaemFM/QS5qcGc" // Replace with your image URL
        alt="Login Illustration"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
);
}

export default Login;
