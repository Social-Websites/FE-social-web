import React from "react";
import classNames from "classnames/bind";
import styles from "../HeaderAdmin.scss";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ArticleIcon from "@mui/icons-material/Article";
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink } from "react-router-dom";
import useLogout from "../../../../shared/hook/auth-hook/logout-hook";

const cx = classNames.bind(styles);

const SideNavAdminData = ({ handleDrawerClose }) => {
  const { logout } = useLogout();
  const listItemData = [
    {
      label: "Dashboard",
      link: "dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "Users",
      link: "users",
      icon: <PermIdentityIcon />,
    },
    { label: "Posts", link: "posts", icon: <ArticleIcon /> },
    { label: "Reports", link: "reports", icon: <ReportGmailerrorredOutlinedIcon /> },
    {
      label: "Logout",
      link: "logout",
      handleOnClick: logout,
      icon: <LogoutIcon />,
    },
  ];

  return (
    <List>
      {listItemData.map((item, i) => (
        <Button
          size="small"
          className={cx("nav-button")}
          onClick={handleDrawerClose}
          key={i}
        >
          <ListItem
            component={NavLink}
            to={item?.link}
            className={cx("nav-links")}
            onClick={item?.handleOnClick}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </ListItem>
        </Button>
      ))}
    </List>
  );
};

export default SideNavAdminData;
