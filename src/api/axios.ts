import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { RecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export const Client = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Be cautious with this
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  withCredentials: true,
});

// Token management without hooks
let currentToken: string | null = null;

export const updateToken = (token: string | null) => {
  currentToken = token;
  if (token) {
    localStorage.setItem("jwt_token", token);

    Client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    Client.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
  } else {
    localStorage.removeItem("jwt_token");

    delete Client.defaults.headers.common["Authorization"];
  }
};

Client.interceptors.request.use((config) => {
  const token = currentToken || localStorage.getItem("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        if (newToken) {
          updateToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return Client(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh failure (logout user, redirect to login)
        updateToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await Client.post("/auth/refresh", {
      withCredentials: true,
    });
    const { accessToken } = response.data;
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Utility hook for components
export const useTokenManagement = (tokenState: RecoilState<string | null>) => {
  const token = useRecoilValue(tokenState);
  const setToken = useSetRecoilState(tokenState);

  useEffect(() => {
    updateToken(token);
  }, [token]);

  return { token, setToken, updateToken };
};
