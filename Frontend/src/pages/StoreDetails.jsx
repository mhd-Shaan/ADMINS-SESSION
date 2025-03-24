import React, { useState } from "react";
import { Card, CardContent, Typography, Tabs, Tab, Grid, Divider } from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  Store as StoreIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Gavel as GavelIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

const StoreDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();
  const store = location.state;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <Card className="w-full max-w-4xl shadow-xl rounded-lg bg-white">
        {/* Tabs Navigation */}
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => setTabIndex(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          className="border-b"
        >
          <Tab label="Personal Details" className="w-1/3 font-semibold" />
          <Tab label="Shop Details" className="w-1/3 font-semibold" />
          <Tab label="PickUp Details" className="w-1/3 font-semibold" />
        </Tabs>

        {/* Personal Details */}
        {tabIndex === 0 && (
          <CardContent className="p-6">
            <Typography variant="h6" className="font-bold mb-4">Personal Information</Typography>
            <Divider className="mb-4" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <LocationOnIcon className="text-blue-600 mr-2" />
                <strong>Full Name:</strong> {store.storeDetails.fullName}
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <PhoneIcon className="text-blue-600 mr-2" />
                <strong>Phone:</strong> {store.storeDetails.mobileNumber}
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <EmailIcon className="text-blue-600 mr-2" />
                <strong>Email:</strong> {store.storeDetails.email}
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Shop Details */}
        {tabIndex === 1 && (
          <CardContent className="p-6">
            <Typography variant="h6" className="font-bold mb-4">Shop Information</Typography>
            <Divider className="mb-4" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <GavelIcon className="text-blue-600 mr-2" />
                <strong>GST Number:</strong> {store.storeDetails.GSTIN}
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <GavelIcon className="text-blue-600 mr-2" />
                <strong>PAN Number:</strong> {store.storeDetails.pannumber || "N/A"}
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <StoreIcon className="text-blue-600 mr-2" />
                <strong>Shop Name:</strong> {store.storeDetails.pickupDetails.shopName}
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* PickUp Details */}
        {tabIndex === 2 && (
          <CardContent className="p-6">
            <Typography variant="h6" className="font-bold mb-4">Pickup Details</Typography>
            <Divider className="mb-4" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <StoreIcon className="text-blue-600 mr-2" />
                <strong>Shop Name:</strong> {store.storeDetails.pickupDetails.shopName}
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <CodeIcon className="text-blue-600 mr-2" />
                <strong>Pickup Code:</strong> {store.storeDetails.pickupDetails.pickupCode}
              </Grid>
              <Grid item xs={12} sm={6} className="flex items-center">
                <LocationOnIcon className="text-blue-600 mr-2" />
                <strong>Address:</strong> {store.storeDetails.pickupDetails.address}
              </Grid>
              <Grid item xs={12} className="flex items-center">
                <DescriptionIcon className="text-blue-600 mr-2" />
                <strong>Description:</strong> {store.storeDetails.storeDescription}
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default StoreDetails;