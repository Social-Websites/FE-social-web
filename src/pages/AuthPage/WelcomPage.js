import React, { useCallback, useEffect, useState } from "react";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { getUser } from "../../services/userService";
import useAuth from "../../shared/hook/auth-hook/auth-hook";
import { useNavigate } from "react-router-dom";

const WelcomPage = () => {
  return <div>NESTME</div>;
};

export default WelcomPage;
