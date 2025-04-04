/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.users.user);
  const token = useSelector((state) => state.users.token);

  if (!token) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(user?.role.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
