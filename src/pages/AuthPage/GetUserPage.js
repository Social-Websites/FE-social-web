import React, { useCallback, useEffect, useState } from "react";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-axios-hook";
import { getUser } from "../../services/userService";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
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
        if (response && !isLoading) {
          navigate("/", { replace: true });
        } else {
          navigate("/accounts/login", { replace: true });
        }
        console.log(user);
      } catch (err) {
        console.log(err.message);
      }
    };
    console.log(auth);
    fetchUser();
  }, [auth]);
  return <div>NESTME</div>;
};

export default GetUserPage;
