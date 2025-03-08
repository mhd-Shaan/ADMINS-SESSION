import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Use axios to send requests
import { TextField, Button, Container, Typography } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

const AddAdmin = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  

  const navigate = useNavigate();

const handlevalidation =()=>{
  if(!adminData.name){
    toast.error('admin name is required')
  }
  if(!adminData.email){
    toast.error('admin email is required')
  }
  if(!adminData.password){
    toast.error("admin password is required")
  }
  if(adminData.password.length < 6){
    toast.error("admin password must be more than 6 charachter")

  }
}

  // Handle input change
  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      await axios.post("http://localhost:5000/registeradmins", adminData,{
        headers: {
          "Authorization": `Bearer ${token}`  // ✅ Send token in headers
        }
      });
      toast.success("Admin added successfully!");
      navigate("/home/manage-admins"); // Redirect after adding admin
    console.log('admin added');
    
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("Failed to add admin!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add New Admin
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={adminData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          name="email"
          value={adminData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          value={adminData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button onClick={handlevalidation}  type="submit" variant="contained" color="primary" fullWidth>
          Add Admin
        </Button>
      </form>
    </Container>
  );
};

export default AddAdmin;
