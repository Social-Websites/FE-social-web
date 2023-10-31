import React, { useCallback, useEffect, useState } from "react";
import usePrivateHttpClient from "../../shared/hook/private-http-hook";
import { getUser } from "../../services/userService";
import useAuth from "../../shared/hook/auth-hook";
import { useNavigate } from "react-router-dom";

const GetUserPage = () => {
  const { auth, user, setUserLogin } = useAuth();
  const navigate = useNavigate();
  const { isLoading, error, clearError, privateRequest } =
    usePrivateHttpClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(privateRequest);
        setUserLogin(response);
        if (response) {
          navigate("/", { replace: true });
        }
        console.log(user);
      } catch (err) {
        console.log(err.message);
      }
    };
    console.log(auth);
    fetchUser();
  }, [auth]);
  return <div></div>;
};

export default GetUserPage;
