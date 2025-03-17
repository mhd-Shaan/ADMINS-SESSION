import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import toast from "react-hot-toast";

const AddAdmin = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const navigate = useNavigate();

  const handleValidation = () => {
    if (!adminData.name) {
      toast.error("Admin name is required");
      return false;
    }
    if (!adminData.email) {
      toast.error("Admin email is required");
      return false;
    }
    if (!adminData.password) {
      toast.error("Admin password is required");
      return false;
    }
    if (adminData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/registeradmins", adminData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Admin added successfully!");
      navigate("/home/manage-admins");
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={5}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            color="#0b1a30"
            mb={2}
          >
            Add Admin
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={adminData.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={adminData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={adminData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              Add Admin
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddAdmin;
