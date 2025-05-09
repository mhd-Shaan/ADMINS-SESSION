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
import {
  IconButton,
  InputAdornment,
  TextField,
  MenuItem,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom"; // Added for navigation

function CategoryComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  const navigate = useNavigate(); // Used for routing to subcategory page

  const openModal = () => {
    setIsOpen(true);
    setName("");
    setImage(null);
  };

  const closeModal = () => setIsOpen(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/view-category", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          status: filterStatus,
        },
      });
      setCategories(response.data.category);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchQuery, filterStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/add-category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Category added successfully");
      closeModal();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || "Submission failed");
    }
  };

  const handleBlockUnblock = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/category-status/${id}`, // Ensure the correct route
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Status updated");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch mb-6 w-full">
        <div className="w-full md:w-[45%]">
          <TextField
            label="Search Categories"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </div>
        <div className="w-full md:w-[25%]">
          <TextField
            select
            label="Filter"
            value={filterStatus}
            onChange={handleFilterChange}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="all">Show All</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
            <MenuItem value="unblocked">Unblocked</MenuItem>
          </TextField>
        </div>
        <div className="w-full md:w-[25%]">
          <button
            onClick={openModal}
            className="bg-blue-600 w-full text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-4">
              Add Category
            </Dialog.Title>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
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
      <div className="overflow-auto max-h-[65vh]">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead className="bg-blue-50 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600 divide-y">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 rounded object-cover shadow-sm"
                  />
                </td>
                <td className="py-3 px-6">{category.name}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      category.isBlocked
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {category.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                      <div className="p-1">
                        {/* View SubCategories */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                navigate(`/home/subcategories/${category._id}`)
                              }
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex items-center w-full px-3 py-2 text-sm text-blue-600 rounded`}
                            >
                              📂 View SubCategories
                            </button>
                          )}
                        </Menu.Item>

                        {/* Block/Unblock */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                handleBlockUnblock(category._id)
                              }
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded`}
                            >
                              {category.isBlocked ? (
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

                        {/* Delete */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDelete(category._id)}
                              className={`${
                                active ? "bg-red-50" : ""
                              } flex items-center w-full px-3 py-2 text-sm text-red-600 rounded`}
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
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
}

export default CategoryComponent;
