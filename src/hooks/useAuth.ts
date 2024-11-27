import { tokenState, userState } from "@/atoms/Atom";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";



const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const currentUser = useRecoilValue(userState);
  const currentToken = useRecoilValue(tokenState);

  useEffect(() => {
    setIsAuthenticated(!!currentUser && !!currentToken);
  }, [currentUser, currentToken]);

  return isAuthenticated;
};

export default useAuth;

