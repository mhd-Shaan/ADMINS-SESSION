import React, { useState, useEffect } from "react";
import {
  DataGrid
} from "@mui/x-data-grid";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import axios from "axios";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("Processing");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // ensure all orders have a user object
      const safeOrders = data.orders.map(order => ({
        ...order,
        user: order.user || {},
        assignedPartner: order.assignedPartner || {}
      }));

      setOrders(safeOrders);
      console.log(safeOrders);
      
      
      setLoading(false);
    } catch (err) {
      console.log("Failed to fetch orders:", err);
      setLoading(false);
    }
  };

  const handleAssign = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/${orderId}/assign`,
        { partnerId: "670b456ef9d0f1b123456789" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert("Delivery partner assigned!");
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || "Processing");
    setOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/orders/${selectedOrder._id}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert("Order status updated!");
      setOpen(false);
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { field: "_id", headerName: "Order ID", flex: 1 },
    {
      field: "user",
      headerName: "Customer",
      flex: 1,
      valueGetter: (params) => {
    return params?.name || "N/A"; // return the name or fallback
}

    },

    {
      field: "shippingAddress",
      headerName: "Address",
      flex: 2,
      valueGetter: (params) =>{
        return `${params.address},${params.city}` || 'N/A'
      }
     
    },
    {
      field: "orderItems",
      headerName: "Items",
      flex: 0.5,
      valueGetter: (params) => params.length || 0,
    },
    { field: "totalPrice", headerName: "Amount", flex: 0.7 },
    { field: "paymentStatus", headerName: "Payment", flex: 0.7 },
    { field: "orderStatus", headerName: "Status", flex: 1 },
    {
      field: "assignedPartner",
      headerName: "Delivery Partner",
      flex: 1,
      valueGetter: (params) => params?.name || "Not Assigned",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Button
            variant="contained"
            size="small"
            onClick={() => handleAssign(params.row._id)}
          >
            Assign
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenUpdate(params.row)}
          >
            Update
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Typography variant="h4" gutterBottom>
        Manage Orders
      </Typography>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </div>

      {/* Update Status Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleUpdateStatus}
          >
            Update
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageOrders;
