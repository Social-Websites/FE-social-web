import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./HeaderAdmin.scss";
import NavBarAdmin from "./NavBar";
import SideNavAdmin from "./SideNav/SideNav";
import { Routes, Route } from "react-router-dom";
import DashboardBody from "../AdminBody/Dashboard/Dashboard";
import PostsManage from "../AdminBody/Posts";
import UsersManage from "../AdminBody/Users";
import { Box } from "@mui/material";

const cx = classNames.bind(styles);

const HeaderAdmin = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div>
      <NavBarAdmin handleDrawerToggle={handleDrawerToggle} />
      <SideNavAdmin
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box className={cx("wrapper")}>
        <Routes>
          <Route path="dashboard" element={<DashboardBody />} />
          <Route path="users" element={<PostsManage />} />
          <Route path="posts" element={<UsersManage />} />
        </Routes>
      </Box>
    </div>
  );
};

export default HeaderAdmin;
