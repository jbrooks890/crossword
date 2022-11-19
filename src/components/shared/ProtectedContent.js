import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextProvider";
import jwt_decode from "jwt-decode";

export default function ProtectedContent({ allowedRoles }) {
  const { auth } = useAuth();
  const { roles } = auth;
  const location = useLocation();

  // console.log(allowedRoles);

  return roles.find(role => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace /> // TODO
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
