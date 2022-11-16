import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextProvider";
import jwt_decode from "jwt-decode";

export default function ProtectedContent({ allowedRoles }) {
  const { auth } = useAuth();
  const location = useLocation();

  const decoded = auth?.accessToken ? jwt_decode(auth.accessToken) : undefined;
  const roles = decoded?.credentials?.roles || [];

  return roles.find(role => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
