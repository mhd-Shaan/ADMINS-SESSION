import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import StoreIcon from "@mui/icons-material/Store";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import GavelIcon from "@mui/icons-material/Gavel";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";

const ManageProducts = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();
  const store = location.state;
  console.log("Store Data:", store.store);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <Card className="w-full max-w-6xl shadow-lg rounded-lg p-6 bg-white">
        {/* Tabs for Navigation */}
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => setTabIndex(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          className="mb-4"
        >
          <Tab label="Store Details" className="w-1/3" />
          <Tab label="Approved Products" className="w-1/3" />
          <Tab label="Pending Products" className="w-1/3" />
        </Tabs>

        {/* Store Details Section */}
        {tabIndex === 0 && (
          <CardContent className="w-full">
            <div className="flex items-center mb-6">
              
              <Typography variant="h5" className="ml-4 font-bold">
                {store.store.shopName}
              </Typography>
            </div>

            <Divider className="mb-4" />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="flex items-center">
                  <LocationOnIcon className="text-gray-600 mr-2" />
                  <strong>Address:</strong>&nbsp; {store.store.pickupDetails.address}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="flex items-center">
                  <PhoneIcon className="text-gray-600 mr-2" />
                  <strong>Phone:</strong>&nbsp; {store.store.mobileNumber}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="flex items-center">
                  <EmailIcon className="text-gray-600 mr-2" />
                  <strong>Email:</strong>&nbsp; {store.store.email}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="flex items-center">
                  <GavelIcon className="text-gray-600 mr-2" />
                  <strong>GST Number:</strong>&nbsp; {store.store.GSTIN}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="flex items-center">
                  <CodeIcon className="text-gray-600 mr-2" />
                  <strong>Pickup Code:</strong>&nbsp; {store.store.pickupDetails.pickupCode}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" className="flex items-center">
                  <DescriptionIcon className="text-gray-600 mr-2" />
                  <strong>Description:</strong>&nbsp; {store.store.storeDescription}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Approved Products Section */}
        {tabIndex === 1 && (
          <CardContent className="w-full">
            <Typography variant="h5" className="mb-2">
              Approved Products
            </Typography>
            <Typography variant="body2">
              List of approved products will be shown here.
            </Typography>
          </CardContent>
        )}

        {/* Pending Products Section */}
        {tabIndex === 2 && (
          <CardContent className="w-full">
            <Typography variant="h5" className="mb-2">
              Pending Products
            </Typography>
            <Typography variant="body2">
              List of pending products waiting for approval.
            </Typography>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ManageProducts;
