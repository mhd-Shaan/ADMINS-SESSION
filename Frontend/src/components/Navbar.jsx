import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../Redux/adminSlice";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, IconButton, Badge } from "@mui/material";
import { Notifications, AccountCircle } from "@mui/icons-material";

const Navbar = () => {
  const [open, setOpen] = useState(false); 
  const [anchorEl, setAnchorEl] = useState(null); 
  const [notificationCount, setNotificationCount] = useState(3); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Open Logout Dialog
  const handleOpenDialog = () => setOpen(true);

  // Close Logout Dialog
  const handleCloseDialog = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    localStorage.removeItem('token'); 
    navigate('/'); 
    setOpen(false); 
  };

  // Open Profile Menu
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close Profile Menu
  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  // Navigate to Profile Page
  const handleProfile = () => {
    navigate('/profile');
    handleCloseProfileMenu();
  };

  return (
    <>
      <header className="bg-white shadow-md w-full h-16 flex items-center px-6 justify-between z-40">
        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <IconButton color="primary">
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile Icon */}
          <IconButton onClick={handleProfileClick} color="primary">
            <AccountCircle fontSize="large" />
          </IconButton>

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseProfileMenu}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleOpenDialog}>Logout</MenuItem>
          </Menu>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
