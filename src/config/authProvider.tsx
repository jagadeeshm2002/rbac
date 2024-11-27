import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "@/atoms/Atom";
import { Role } from "@/types/user.types";

interface AuthProviderProps {
  children: React.ReactNode;
  roles: Role[];
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children, roles }) => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user's role is in the allowed roles
    const isAuthorized = roles.some(
      (allowedRole) => allowedRole === user.role?.name
    );

    // If not authorized, redirect to unauthorized page
    if (!isAuthorized) {
      navigate("/unauthorized", { replace: true });
    }
  }, [user, roles, navigate]);

  // If authorized, render children
  return roles.some((allowedRole) => allowedRole === user.role?.name) ? (
    <>{children}</>
  ) : null;
};

export default AuthProvider;
