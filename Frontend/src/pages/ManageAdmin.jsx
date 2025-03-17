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
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

function ManageAdmin() {
  const [admins, setAdmins] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const adminPerPage = 10; 
  
  const navigate = useNavigate();

  
  

  useEffect(() => {
    
    const fetchData = async (page) => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get(`http://localhost:5000/getadmins?page=${page}&limit=${adminPerPage}`,{
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        });
        setAdmins(response.data.adminlist);
        console.log(response.data.totalPages);
        
        setTotalPages(Math.ceil(response.data.totalPages));
        console.log(response.data);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchData(currentPage);
  }, [currentPage]); 

  // Function to toggle block/unblock admin
  const blockandunblock = async (adminId, currentStatus) => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.put(
        `http://localhost:5000/block-unblock-admin/${adminId}`, 
        {}, {
          headers: {
            "Authorization": `Bearer ${token}`  // ✅ Send token in headers
          }
        }
      );
  
      console.log("Block Status Updated:", response.data);
  
      // Update admin status in the state
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === adminId ? { ...admin, isblock: !currentStatus } : admin
        )
      );
  
      toast.success(`Admin ${!currentStatus ? "Blocked" : "Unblocked"} Successfully`);
    } catch (error) {
      console.error("Error updating admin status:", error);
  
      if (error.response?.status === 403) {
        toast.error("Unauthorized: You do not have permission.");
      } else {
        toast.error("Failed to update admin status. Please check permissions.");
      }
    }
  };

  // Open edit dialog
  const handleOpenEditDialog = (admin) => {
    setSelectedAdmin(admin);
    setEditedName(admin.name);
    setEditedEmail(admin.email);
    setOpenEditDialog(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedAdmin(null);
  };

  // Update admin details
  const handleEditAdmin = async () => {
    if (!selectedAdmin) {
      console.error("No admin selected!");
      return;
    }
  
    if (!editedName) {
      toast.error("fullname is required"); // Debugging check
      return; // Prevent API call if name is empty
    }

    if (!editedEmail) {
      toast.error("email is requored")
      return; // Prevent API call if name is empty
    }

    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.put(`http://localhost:5000/editadmin/${selectedAdmin._id}`, {
        name: editedName,
        email: editedEmail,
      },
      {
        headers: {
          "Authorization": `Bearer ${token}`  // ✅ Send token in headers
        }
      }
    );

      if (response.status === 200) {
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin._id === selectedAdmin._id
              ? { ...admin, name: editedName, email: editedEmail }
              : admin
          )
        );
        handleCloseEditDialog();
        toast.success('admin edited succesfully')
      }
    } catch (error) {
      console.error("Error updating admin details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Main Content */}
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Admins</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/home/add-admins")}
          >
            Add New Admin
          </Button>
        </div>

        {/* Admin Table */}
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-200">
                <TableCell className="font-semibold">#</TableCell>
                <TableCell className="font-semibold">Full Name</TableCell>
                <TableCell className="font-semibold">Email</TableCell>
                <TableCell className="font-semibold">Actions</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <TableRow key={admin._id} className="hover:bg-gray-100">
                  <TableCell>{(currentPage - 1) * adminPerPage + index + 1}</TableCell>
                    {/* <TableCell>{index + 1}</TableCell> */}
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleOpenEditDialog(admin)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={admin.isblock ? "success" : "error"}
                        size="small"
                        onClick={() => blockandunblock(admin._id, admin.isblock)}
                      >
                        {admin.isblock ? "Unblock" : "Block"}
                      </Button>
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
        <div className="flex justify-center mt-4">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                />
              </div>
      </div>

      {/* Edit Admin Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditAdmin} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      
    </div>
  );
}

export default ManageAdmin;
