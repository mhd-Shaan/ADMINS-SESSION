import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const ManageProducts = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();
  const store = location.state;
  console.log("Store Data:", store.store);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <Card className="w-full max-w-6xl shadow-lg rounded-lg p-6 bg-white">
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

        {tabIndex === 0 && (
          <CardContent className="w-full">
            <div className="flex items-center mb-4">
              {/* <div className="w-20 h-20 bg-gray-200 rounded-full flex justify-center items-center">
                <span className="text-2xl font-semibold">🛒</span>
              </div> */}
              <Typography variant="h5" className="ml-4 font-bold">
                {store.store.shopName}{" "}
              </Typography>
            </div>
            <Typography variant="body1" className="mb-2 font-semibold">
              Address:{" "}
              <span className="font-normal">
                {store.store.pickupDetails.address}
              </span>
            </Typography>
            <Typography variant="body1" className="mb-2 font-semibold">
              Phone:{" "}
              <span className="font-normal">{store.store.mobileNumber}</span>
            </Typography>
            <Typography variant="body1" className="mb-2 font-semibold">
              Email: <span className="font-normal">{store.store.email}</span>
            </Typography>
            <Typography variant="body1" className="mb-2 font-semibold">
              GST Number:{" "}
              <span className="font-normal">{store.store.GSTIN}</span>
            </Typography>
            <Typography variant="body1" className="mb-2 font-semibold">
              Pickup code:{" "}
              <span className="font-normal">
                {store.store.pickupDetails.pickupCode}
              </span>
            </Typography>
            <Typography variant="body1" className="mb-4 font-semibold">
              Description:{" "}
              <span className="font-normal">
                {store.store.storeDescription}
              </span>
            </Typography>
            
          </CardContent>
        )}

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
