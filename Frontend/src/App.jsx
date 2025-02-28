import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import AdminRoutes from "./Redux/AdminRoutes";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, logoutAdmin } from "./Redux/adminSlice";


function App() {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);
console.log('is',admin);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<Layout> <Main /> </Layout>}>
        <Route index element={<Main />} />  {/* This ensures Admin Dashboard loads first */}
       <Route path="manage-store" element={<ManageStore />} />
       <Route path="manage-advertisement" element={<Advertiment />} />
       <Route path="manage-reviews" element={<Reviews />} />
       
       <Route path="manage-admins"  element={admin && admin.role === "superadmin" ? 
      (<ManageAdmin />) : (<Navigate to="/home" />)} />
      <Route path="add-admins" element={<AddAdmin />} />
          <Route path="adminsuspended" element={<Adminsuspended/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
