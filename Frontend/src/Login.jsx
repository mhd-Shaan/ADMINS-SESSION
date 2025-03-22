import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "./Redux/adminSlice";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const adminState = useSelector((state) => state.admin);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token]);

  const validate = () => {
    if (!data.email) {
      toast.error("Email is required");
      return false;
    }
    if (!data.password) {
      toast.error("Password is required");
      return false;
    }
    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const loginadmins = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { email, password } = data;

    try {
      const response = await axios.post(
        "http://localhost:5000/loginadmins",
        { email, password }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else if (response.data.token) {
        dispatch(loginAdmin({ admin: response.data.admin, token: response.data.token }));
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/car-accessories-with-copy-space_23-2149030423.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative bg-[#162a4b] p-8 rounded-3xl shadow-lg text-white w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-4">Spare Mart</h2>
        <p className="text-center text-gray-400 mb-6">
          Sign in to access your account.
        </p>
        <form onSubmit={loginadmins}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-[#0b1a30] text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-[#0b1a30] text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="absolute -top-6 right-6 w-12 h-12 bg-[#0b1a30] rounded-full flex items-center justify-center shadow-md">
          <span className="text-xl">🔧</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
