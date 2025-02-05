import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.users.user); // Fetch user from Redux
  const token = useSelector((state) => state.users.token);
  console.log(user);

  if (!token) return <Navigate to="/" replace />; // Redirect if not logged in

  if (!allowedRoles.includes(user?.role.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />; // Redirect if role not allowed
  }

  return <Outlet />; // Allow access
};

export default ProtectedRoute;
