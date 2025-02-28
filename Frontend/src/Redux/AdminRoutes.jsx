import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const adminState = useSelector((state) => state.admin);
  console.log("Admin State:", adminState); // Debugging
  
  // Check where the role is located
  const role = adminState?.admin?.role; 
  console.log("Extracted Role:", role); // Debugging

  return role === "superadmin" ? <Outlet /> : <Navigate to="/home/manage-admins" />;
};

export default AdminRoutes;
