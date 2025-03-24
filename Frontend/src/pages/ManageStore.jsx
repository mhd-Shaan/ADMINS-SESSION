import React, { useState, useEffect } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";


function ManageStore() {
  const [stores, setStores] = useState([]);
  const [approvedStores, setApprovedStores] = useState([]);
    const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const navigate = useNavigate()
  const storesPerPage = 10

  useEffect(() => {
    if (activeTab === "pending") {
      pendingstores();
    } else {
      Approvedstores();
    }
  }, [currentPage, activeTab,searchQuery,filterStatus]); 

  const pendingstores = async () => {
    try {
      const token = localStorage.getItem("token");
      const pendingResponse = await axios.get(
        "http://localhost:5000/getstorespending",{
        params: {
          page: currentPage,
          limit: storesPerPage,
          search: searchQuery,
        },
          headers: { Authorization: `Bearer ${token}` },
      }
      );
      setStores(pendingResponse.data.StoreDetails);
      setTotalPages(pendingResponse.data.totalPages)
      
    } catch (error) {
      console.error("Error fetching pending stores:", error);
    }
  };

  const Approvedstores = async () => {
    try {
      const token = localStorage.getItem("token");
      const approvedResponse = await axios.get(
        "http://localhost:5000/getstores",{
          params: {
            page: currentPage,
            limit: storesPerPage,
            search: searchQuery,
            status:filterStatus,
          },
        headers: { Authorization: `Bearer ${token}` },
      }
      );
      setApprovedStores(approvedResponse.data.StoreDetails || []);
      
      setTotalPages(approvedResponse.data.totalPages)

    } catch (error) {
      console.error("Error fetching approved stores:", error);
      toast.error(error.response.data.error);
    }
  };

  const approvingStore = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/store-approval/${storeId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const approvedStore = stores.find((store) => store._id === storeId);
      setApprovedStores([...approvedStores, approvedStore]);
      setStores(stores.filter((store) => store._id !== storeId));
      toast.success("Store approved successfully");
      handleCloseMenu()
    } catch (error) {
      console.error("Error approving store:", error);
    }
  };

  const rejectingStore = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/store-rejecting/${storeId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStores(stores.filter((store) => store._id !== storeId));
      toast.success("Store rejected successfully");
      handleCloseMenu()

    } catch (error) {
      console.error("Error rejecting store:", error);
    }
  };

  const toggleBlockStore = async (storeId, isBlocked) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/block-unblock-store/${storeId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApprovedStores(
        approvedStores.map((store) =>
          store._id === storeId ? { ...store, isBlocked: !isBlocked } : store
        )
      );
      toast.success(`Store ${!isBlocked ? "blocked" : "unblocked"} successfully`);
      handleCloseMenu()

    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  const handleMenuClick = (event, storeId) => {
    setAnchorEl(event.currentTarget);
    setSelectedStoreId(storeId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedStoreId(null);
  };

  const handleViewStore = (store) => {
    console.log(store);
    
    navigate('/home/Storedetails' ,{ state: { storeDetails: store } })
    handleCloseMenu();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className=" bg-gray-100 ">
  <div className="flex items-center gap-4">  {/* Flex container with spacing */}
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
      className="w-full md:w-5/6"
    />

    {activeTab === 'approved' && (
      <TextField
        select
        label="Filter"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        variant="outlined"
        className="w-full md:w-1/4"
      >
        <MenuItem value="all">Show All</MenuItem>
        <MenuItem value="blocked">Blocked Stores</MenuItem>
        <MenuItem value="unblocked">Unblocked Stores</MenuItem>
      </TextField>
    )}
  </div>
</div>
      <div className="flex justify-center border-b">
        <button
          className={`px-4 py-2 w-1/2 text-center ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Stores
        </button>
        <button
          className={`px-4 py-2 w-1/2 text-center ${
            activeTab === "approved"
              ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved Stores
        </button>
      </div>
      
      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4 mt-4">


        <TableContainer component={Paper}>
          <Table>
            <TableHead>
                    <TableRow className="bg-gray-200">
                <TableCell>#</TableCell>
                <TableCell>Store Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(activeTab === "pending" ? stores : approvedStores).length > 0 ? (
                (activeTab === "pending" ? stores : approvedStores).map(
                  (store, index) => (
                    <TableRow key={store._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Link
                          to="/home/manage-store/manageproducts"
                          state={{ store }}
                          className="text-blue-600 hover:underline"
                        >
                          {store.shopName}
                        </Link>
                      </TableCell>
                      <TableCell>{store.email}</TableCell>
                      <TableCell>
                        {activeTab === "approved" ? (
                          <Chip
                            label={store.isBlocked ? "Blocked" : "Active"}
                            color={store.isBlocked ? "error" : "success"}
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="Pending"
                            color="warning"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, store._id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={selectedStoreId === store._id}
                          onClose={handleCloseMenu}
                        >
                          {activeTab === "pending" ? [
                         
                          
                              <MenuItem onClick={() => approvingStore(store._id)}>
                                Accept
                              </MenuItem>,
                              <MenuItem onClick={() => rejectingStore(store._id)}>
                                Reject
                              </MenuItem>,
                           ] : [
                            <MenuItem
                              onClick={() =>
                                toggleBlockStore(store._id, store.isBlocked)
                              }
                            >
                              {store.isBlocked ? "Unblock" : "Block"}
                            </MenuItem>
                          ]}
                          <MenuItem onClick={() => handleViewStore(store)}>
                            View
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {activeTab === "pending"
                      ? "No pending stores."
                      : "No approved stores."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </div>
    </div>
  );
}

export default ManageStore;