import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileDetails = () => {
  const { admin } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  // Initialize state
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Update state when admin data is available
  useEffect(() => {
    if (admin) {
      setUser({
        name: admin.name ,
        email: admin.email ,
        password: "********", // Keep masked for security
        role: admin.role ,
      });
    }
  }, [admin]); 


  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Details</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Name:</span>
          <span className="text-gray-800">{user.name}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Email:</span>
          <span className="text-gray-800">{user.email}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Password:</span>
          <span className="text-gray-800">{user.password}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Role:</span>
          <span className="text-gray-800">{user.role}</span>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        Back
      </button>
    </div>
  );
};

export default ProfileDetails;
