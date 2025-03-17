import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Pagination, TextField, InputAdornment, IconButton 
} from "@mui/material";
import toast from "react-hot-toast";
import SearchIcon from "@mui/icons-material/Search";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered list
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10; // Define users per page

  // Fetch user data from backend with pagination
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/getallusers?page=${page}&limit=${usersPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.userdetails);
      setFilteredUsers(response.data.userdetails); // Initially set filtered users
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch users.");
    }
  };

  // Function to filter users based on search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredUsers(users); // Reset if empty
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Function to block/unblock user
  const blockAndUnblock = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/user-block-unblock/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: !currentStatus } : user
        )
      );

      toast.success(`User ${!currentStatus ? "Blocked" : "Unblocked"} Successfully`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        
        {/* Search Field */}
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="mb-4"
        />

        <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
        
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-200">
                <TableCell className="font-semibold">#</TableCell>
                <TableCell className="font-semibold">Full Name</TableCell>
                <TableCell className="font-semibold">Email</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <TableRow key={user._id} className="hover:bg-gray-100">
                    <TableCell>{(currentPage - 1) * usersPerPage + index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={user.isBlocked ? "success" : "error"}
                        size="small"
                        onClick={() => blockAndUnblock(user._id, user.isBlocked)}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex justify-center mt-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
