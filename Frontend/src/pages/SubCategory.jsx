import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { HiDotsVertical } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";

function SubCategory() {
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const menuRef = useRef(null);

  useEffect(() => {
    fetchSubcategories();
  }, [id, currentPage, searchQuery, filterStatus]);


  const fetchSubcategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/view-subcategory/${id}?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&status=${filterStatus}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubcategories(response.data.subcategory || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch subcategories");
      console.error(error);
    }
  };

  const openAddModal = () => {
    setIsOpen(true);
    setEditMode(false);
    setName("");
    setImage(null);
    setPreviewImage(null);
  };

  const openEditModal = (sub) => {
    setIsOpen(true);
    setEditMode(true);
    setSelectedSub(sub);
    setName(sub.name);
    setPreviewImage(sub.image);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!name || !image) {
      toast.error("Please provide name and image");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("categoryId", id);
      await axios.post("http://localhost:5000/add-subcategory", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Subcategory added");
      setIsOpen(false);
      fetchSubcategories();
    } catch (error) {
      toast.error("Failed to add subcategory");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubcategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);
      await axios.put(`http://localhost:5000/edit-subcategory/${selectedSub._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Subcategory updated");
      setIsOpen(false);
      fetchSubcategories();
    } catch (error) {
      toast.error("Failed to update subcategory");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (subId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/subcategory-status/${subId}`,{},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Subcategory ${subcategories.isBlocked ? "unblocked" : "blocked"}`);
      fetchSubcategories();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleDelete = async (subId) => {
    setOpenMenuId(null);
    const confirmDelete = window.confirm("Are you sure you want to delete this subcategory?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/delete-subcategory/${subId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Subcategory deleted");
      fetchSubcategories();
    } catch (error) {
      toast.error("Failed to delete subcategory");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="w-full md:w-1/2">
          <TextField
            label="Search Subcategories"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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
        <div className="w-full md:w-1/4">
          <TextField
            select
            label="Filter by status"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            fullWidth
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
            <MenuItem value="unblocked">Unblocked</MenuItem>
          </TextField>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Subcategory
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subcategories.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">{sub.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      sub.isBlocked
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {sub.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 relative">
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === sub._id ? null : sub._id)
                      }
                    >
                      <HiDotsVertical />
                    </button>
                    {openMenuId === sub._id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-50">
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                          onClick={() => {
                            setOpenMenuId(null);
                            openEditModal(sub);
                          }}
                        >
                          <FiEdit2 className="mr-2" />
                          Edit
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                          onClick={() => handleDelete(sub._id)}
                        >
                          <FiTrash2 className="mr-2" />
                          Delete
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                          onClick={() => {
                            setOpenMenuId(null);
                            handleToggleStatus(sub._id, sub.isBlocked);
                          }}
                        >
                          {sub.isBlocked ? (
                            <>
                              <FiEye className="mr-2" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <FiEyeOff className="mr-2" />
                              Block
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          className="my-4"
        />
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              {editMode ? "Edit" : "Add"} Subcategory
            </Dialog.Title>
            <form onSubmit={editMode ? handleEditSubcategory : handleAddSubcategory}>
              <TextField
                label="Subcategory Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mb-4"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded mb-4"
                />
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {loading ? "Saving..." : editMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default SubCategory;
