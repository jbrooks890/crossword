import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextProvider";
import jwt_decode from "jwt-decode";

export default function ProtectedContent({ allowedRoles }) {
  const { auth } = useAuth();
  const location = useLocation();

  console.log(allowedRoles);

  const decoded = auth?.accessToken ? jwt_decode(auth.accessToken) : undefined;
  const roles = decoded?.credentials?.roles || [];
  console.log(auth);
  console.log(roles.join(", "));

  return roles.find(role => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace /> // TODO
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
