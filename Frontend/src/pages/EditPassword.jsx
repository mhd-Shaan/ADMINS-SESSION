import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const EditPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); // ✅ State for email

  const location = useLocation();
  const navigate = useNavigate();
  const { Email } = location.state || {}; // ✅ Get email from state

  // ✅ Use useEffect to set email once
  useEffect(() => {
    if (Email) {
      setEmail(Email);
    }
  }, [Email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email is required!");
      return;
    }
    if (!password) {
      alert("password is required");
      return;
    }
    if (!confirmpassword) {
      alert("confirm password is required");
      return;
    }
    if (password.length < 6) {
      alert("password must be 6-digit minimum");
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/updatepassword",
        {
          email,
          password,
          confirmpassword,
        }
      );
      alert(response.data.message);
      {Email?navigate("/profile"):navigate("/")} // ✅ Redirect to Profile page after success
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Reset Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-gray-600 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!!Email}
            className= {Email?"w-full p-2 border rounded bg-gray-200 cursor-not-allowed":"w-full p-2 border rounded"}
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Update Password
        </button>
      </form>

      <button
  onClick={Email ? () => navigate("/profile") : () => navigate("/")}
  className="mt-3 w-full bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
>
  Cancel
</button>

    </div>
  );
};

export default EditPassword;
