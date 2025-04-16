import React, { useState } from "react";
import { Card, CardContent, Tabs, Tab, Grid, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  Store as StoreIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Gavel as GavelIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";

const StoreDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();
  const store = location.state;

  if (!store || !store.storeDetails) {
    return <p className="text-center text-red-600">No store details available.</p>;
  }

  const { storeDetails } = store;
  const { pickupDetails, pdfUrls } = storeDetails;
  

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
          centered
          className="border-b"
        >
          <Tab label="Personal Details" sx={{ fontWeight: "bold" }} />
          <Tab label="Shop Details" sx={{ fontWeight: "bold" }} />
          <Tab label="Pickup Details" sx={{ fontWeight: "bold" }} />
          <Tab label="Documents" sx={{ fontWeight: "bold" }} />
        </Tabs>

        {/* Personal Details */}
        {tabIndex === 0 && (
          <CardContent className="p-6">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <LocationOnIcon className="text-blue-600 mr-2" />
                <strong>Owner Name:</strong> {storeDetails.fullName}
              </Grid>
              <Grid item xs={12}  className="flex items-center">
                <PhoneIcon className="text-blue-600 mr-2" />
                <strong>Phone:</strong> {storeDetails.mobileNumber}
              </Grid>
              <Grid item xs={12}  className="flex items-center">
                <EmailIcon className="text-blue-600 mr-2" />
                <strong>Email:</strong> {storeDetails.email}
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Shop Details */}
        {tabIndex === 1 && (
          <CardContent className="p-6">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} className="flex items-center">
                <GavelIcon className="text-blue-600 mr-2" />
                <strong>GST Number:</strong> {storeDetails.GSTIN}
              </Grid>
              <Grid item xs={12} className="flex items-center">
                <GavelIcon className="text-blue-600 mr-2" />
                <strong>PAN Number:</strong> {storeDetails.pannumber || "N/A"}
              </Grid>
              <Grid item xs={12}  className="flex items-center">
                <StoreIcon className="text-blue-600 mr-2" />
                <strong>Shop Name:</strong> {storeDetails.pickupDetails.shopName}
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Pickup Details */}
        {tabIndex === 2 && pickupDetails && (
          <CardContent className="p-6">
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6} className="flex items-center">
                <StoreIcon className="text-blue-600 mr-2" />
                <strong>Shop Name:</strong> {pickupDetails.shopName}
              </Grid> */}
              <Grid item xs={12} sm={6} className="flex items-center">
                <CodeIcon className="text-blue-600 mr-2" />
                <strong>Pickup Code:</strong> {pickupDetails.pickupCode}
              </Grid>
              <Grid item xs={12}  className="flex items-center">
                <LocationOnIcon className="text-blue-600 mr-2" />
                <strong>Address:</strong> {pickupDetails.address}
              </Grid>
              <Grid item xs={12} className="flex items-center">
                <DescriptionIcon className="text-blue-600 mr-2" />
                <strong>Description:</strong> {storeDetails.storeDescription}
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Documents */}
        {tabIndex === 3 && (
          <CardContent className="p-6">
            <Grid container spacing={2}>
              {pdfUrls && pdfUrls.length > 0 ? (
                pdfUrls.map((doc, index) => (
                  <Grid item xs={12} sm={6} key={index} className="flex items-center">
                    <PdfIcon className="text-red-600 mr-2" />
                    <Button
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      View PDF {index + 1}
                    </Button>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <p className="text-gray-500">No documents available.</p>
                </Grid>
              )}
            </Grid>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default StoreDetails;
