// src/components/PrivateRoute.jsx
import { useContext } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // spinner mejor

  return user ? children : <Navigate to="/" replace />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
