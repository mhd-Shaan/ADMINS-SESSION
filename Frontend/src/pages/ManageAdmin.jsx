import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Pagination,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import toast from "react-hot-toast";

function ManageAdmin() {
  const [admins, setAdmins] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAdminId, setMenuAdminId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const adminsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, [currentPage, searchQuery,filterStatus]);

 


  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/getadmins", {
        params: {
          page: currentPage,
          limit: adminsPerPage,
          search: searchQuery,
          status:filterStatus,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
     
      setAdmins(response.data.adminlist);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };


  const handleOpenEditDialog = (admin) => {
    setSelectedAdmin(admin);
    setEditedName(admin.name || "");
    setEditedEmail(admin.email || "");
    setOpenEditDialog(true);
    handleCloseMenu();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedAdmin(null);
  };

  const handleEditAdmin = async () => {
    if (!editedName || !editedEmail) {
      toast.error("Full Name and Email are required!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/editadmin/${selectedAdmin._id}`,
        { name: editedName, email: editedEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === selectedAdmin._id
            ? { ...admin, name: editedName, email: editedEmail }
            : admin
        )
      );

      handleCloseEditDialog();
      toast.success("Admin updated successfully");
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("Failed to update admin.");
    }
  };

  const toggleAdminStatus = async (adminId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/block-unblock-admin/${adminId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === adminId ? { ...admin, isblock: !currentStatus } : admin
        )
      );
      toast.success(
        `Admin ${!currentStatus ? "Blocked" : "Unblocked"} Successfully`
      );
      handleCloseMenu();
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast.error("Failed to update admin status.");
    }
  };

  const handleMenuClick = (event, adminId) => {
    setAnchorEl(event.currentTarget);
    setMenuAdminId(adminId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuAdminId(null);
  };

  return (
    <>
  <div className=" bg-gray-100 flex items-center justify-end pr-6 ">
  <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/home/add-admins")}
          >
            Add New Admin
          </Button>
          </div>

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="w-5/7"
          />

          <TextField
            select
            label="Filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            variant="outlined"
            className="w-1/4"
          >
            <MenuItem value="all">Show All</MenuItem>
            <MenuItem value="blocked">Blocked Admins</MenuItem>
            <MenuItem value="unblocked">Unblocked Admins</MenuItem>
          </TextField>

          
        </div>

        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-200">
                <TableCell>#</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <TableRow key={admin._id}>
                    <TableCell>
                      {(currentPage - 1) * adminsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Tooltip title={admin.isblock ? "Blocked" : "Active"}>
                        <span
                          className={`px-2 py-1 text-white rounded ${
                            admin.isblock ? "bg-red-500" : "bg-green-500"
                          }`}
                        >
                          {admin.isblock ? "Blocked" : "Active"}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuClick(event, admin._id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={menuAdminId === admin._id}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={() => handleOpenEditDialog(admin)}>
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            toggleAdminStatus(admin._id, admin.isblock)
                          }
                        >
                          {admin.isblock ? "Unblock" : "Block"}
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No admins found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Admin Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Full Name"
              value={editedName}
              margin="dense"
              onChange={(e) => setEditedName(e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleEditAdmin} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
         <div className="flex justify-end mt-4">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    color="primary"
                  />
                </div>
      </div>
    </div>
    </>
  );
}

export default ManageAdmin;
