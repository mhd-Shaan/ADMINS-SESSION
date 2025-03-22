import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileDetails = () => {
  const { admin } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });


  useEffect(() => {
    if (admin) {
      setUser({
        name: admin.name,
        email: admin.email,
        role: admin.role,
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
          <span className="font-medium text-gray-600">Role:</span>
          <span className="text-gray-800">{user.role}</span>
        </div>

        <button
        onClick={() => navigate("/reset-password", { state: { Email: user.email } })}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        Reset Password
      </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/home')}
        className="mt-6 w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
      >
        Back
      </button>
    </div>
  );
};

export default ProfileDetails;
