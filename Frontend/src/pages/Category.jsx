import React, { useState, useEffect } from "react";
import { Dialog, Menu } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";

function Category() {
  const [activeTab, setActiveTab] = useState("category");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");

  const openModal = () => {
    setIsOpen(true);
    setName("");
    setImage(null);
  };

  const closeModal = () => setIsOpen(false);

  const fetchItems = async () => {
    try {
      const endpoint =
        activeTab === "category"
          ? "http://localhost:5000/view-category"
          : "http://localhost:5000/view-brands";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(activeTab === "category" ? response.data.category : response.data.brands);
      console.log(response.data);
      
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      const endpoint =
        activeTab === "category"
          ? "http://localhost:5000/add-category"
          : "http://localhost:5000/add-brand";

      await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`${activeTab} added successfully`);
      closeModal();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.error || "Submission failed");
    }
  };

  const handleBlockUnblock = async (id, status) => {
    try {
      const endpoint =
        activeTab === "category"
          ? `http://localhost:5000/category-status/${id}`
          : `http://localhost:5000/brand-status/${id}`;

      await axios.put(
        endpoint,
        { status: status === "active" ? "blocked" : "active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated");
      fetchItems();
    } catch (error) {
      console.log(error);
      
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      const endpoint =
        activeTab === "category"
          ? `http://localhost:5000/delete-category/${id}`
          : `http://localhost:5000/delete-brand/${id}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {activeTab === "category" ? "Manage Categories" : "Manage Brands"}
        </h1>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          + Add {activeTab === "category" ? "Category" : "Brand"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 space-x-4">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "category"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("category")}
        >
          Categories
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "brand"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("brand")}
        >
          Brands
        </button>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-4">
              Add {activeTab === "category" ? "Category" : "Brand"}
            </Dialog.Title>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                  className="w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Table */}
      <div className="mt-6 overflow-auto max-h-[600px]">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-blue-50 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600 divide-y">


{console.log(items)
}
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover shadow-sm"
                  />
                </td>
                <td className="py-3 px-6">{item.name}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.isBlocked === true
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
{item.isBlocked === true ? "Blocked" : "Active"}
</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 top-0 translate-y-10 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                      <div className="p-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleBlockUnblock(item._id, item.status)}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded whitespace-nowrap`}
                            >
                              {item.status === "blocked" ? (
                                <>
                                  <LockOpenIcon className="w-4 h-4 mr-2" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <LockClosedIcon className="w-4 h-4 mr-2" />
                                  Block
                                </>
                              )}
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDelete(item._id)}
                              className={`${
                                active ? "bg-red-50" : ""
                              } flex items-center w-full px-3 py-2 text-sm text-red-600 rounded whitespace-nowrap`}
                            >
                              <TrashIcon className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No {activeTab}s found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Category;
