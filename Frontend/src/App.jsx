import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Layout from "./components/Layout";
import AddAdmin from "./pages/AddAdmin";
import ManageStore from "./pages/ManageStore";
import Reviews from "./pages/Reviews";
import Advertiment from "./pages/Advertiment";
import Main from "./Home";
import ManageAdmin from "./pages/ManageAdmin";
import Adminsuspended from "./pages/Adminsuspended";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "./Redux/adminSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import ManageUsers from "./pages/ManageUsers";
import ProfileDetails from "./components/ProfileDetails";
import EditPassword from "./pages/EditPassword";
import StoreDetails from "./pages/StoreDetails";

function App() {
  const [admins, setAdmin] = useState(null); // Initialize as null
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        console.log("No token found, skipping fetch...");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/getadminDetails",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAdmin(response.data.admin);
        dispatch(
          loginAdmin({ admin: response.data.admin, token: response.data.token })
        );
        console.log("Admin Role:", response.data.admin.role);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        if (error.response) {
          console.log("Server Response:", error.response.data); // Log response for more details
        }
      }
    };

    fetchAdminData();
  }, [dispatch]);

  return (
    <>
          <Toaster position="top-right" reverseOrder={false} />
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
       <Route path="/profile" element={<ProfileDetails/>}></Route>
       <Route path="/reset-password" element={<EditPassword/>}></Route>
        <Route
          path="/home"
          element={
            <Layout>
              <Main />
            </Layout>
          }
        >
          <Route index element={<Main />} />{" "}
          {/* Ensures Admin Dashboard loads first */}
          <Route path="manage-users" element={<ManageUsers/>}></Route>
          <Route path="manage-store" element={<ManageStore />} />
          <Route path="manage-advertisement" element={<Advertiment />} />
          <Route path="manage-reviews" element={<Reviews />} />
          <Route
            path="manage-admins"
            element={
              admin?.role ? (
                admin.role === "superadmin" ? (
                  <ManageAdmin />
                ) : (
                  <Navigate to="/home" />
                )
              ) : (
                <p>Loading...</p> // Wait for state update before deciding
              )
            }
          />
          <Route path="add-admins" element={<AddAdmin />} />
          <Route path="adminsuspended" element={<Adminsuspended />} />
          <Route path="Storedetails" element={<StoreDetails/>}></Route>
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
