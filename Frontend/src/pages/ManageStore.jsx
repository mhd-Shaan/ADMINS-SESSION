import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

function ManageStore() {
  const [stores, setStores] = useState([]);
  const [approvedStores, setApprovedStores] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  

  useEffect(() => {
    pendingstores();
    Approvedstores();

  }, []);

  const pendingstores = async () => {
    try {
      const token = localStorage.getItem("token");
      const pendingResponse = await axios.get("http://localhost:5000/getstorespending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(pendingResponse.data.StoreDetails);
      
      setStores(pendingResponse.data.StoreDetails);
    } catch (error) {
      console.error("Error fetching pending stores:", error);
      toast.error(error.response.data.error);
    }
  };

  const Approvedstores = async () => {
    try {
      const token = localStorage.getItem("token");
      const approvedResponse = await axios.get("http://localhost:5000/getstores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovedStores(approvedResponse.data.StoreDetails || []);
    } catch (error) {
      console.error("Error fetching approved stores:", error);
      toast.error(error.response.data.error);
    }
  };

  const approvingStore = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/store-approval/${storeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const approvedStore = stores.find((store) => store._id === storeId);
      setApprovedStores([...approvedStores, approvedStore]);
      setStores(stores.filter((store) => store._id !== storeId));
    } catch (error) {
      console.error("Error approving store:", error);
    }
  };

  const rejectingStore = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/store-rejecting/${storeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(stores.filter((store) => store._id !== storeId));
    } catch (error) {
      console.error("Error rejecting store:", error);
    }
  };

  const toggleBlockStore = async (storeId, isBlocked) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/block-unblock-store/${storeId}`, { }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovedStores(
        approvedStores.map((store) =>
          store._id === storeId ? { ...store, isBlocked: !isBlocked } : store
        )
      );
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-center">Manage Stores</h2>

      {/* Tabs Section */}
      <div className="flex justify-center border-b">
        <button
          className={`px-4 py-2 w-1/2 text-center ${
            activeTab === "pending" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Stores
        </button>
        <button
          className={`px-4 py-2 w-1/2 text-center ${
            activeTab === "approved" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved Stores
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4 mt-4">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead className="bg-gray-200">
            <tr className="text-gray-700 text-left">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Store Name</th>
              <th className="p-3 border hidden sm:table-cell">Email</th>
              <th className="p-3 border hidden md:table-cell">Phone</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "pending" ? stores : approvedStores).length > 0 ? (
              (activeTab === "pending" ? stores : approvedStores).map((store, index) => (
                <tr key={store._id} className="border-b text-gray-700">
                  <td className="p-3 border text-center">{index + 1}</td>
                  <td className="p-3 border">{store.shopName}</td>
                  <td className="p-3 border hidden sm:table-cell">{store.email}</td>
                  <td className="p-3 border hidden md:table-cell">{store.mobileNumber}</td>
                  <td className="p-3 border text-center">
                    {activeTab === "pending" ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => approvingStore(store._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectingStore(store._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleBlockStore(store._id, store.isBlocked)}
                        className={`px-3 py-1 rounded-md ${
                          store.isBlocked
                            ? "bg-gray-500 hover:bg-gray-600 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {store.isBlocked ? "Unblock" : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  {activeTab === "pending" ? "No pending stores." : "No approved stores."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageStore;