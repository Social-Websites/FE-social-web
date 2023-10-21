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
import { NavLink } from "react-router-dom";

const cx = classNames.bind(styles);

const SideNavAdminData = ({ handleDrawerClose }) => {
  const listItemData = [
    {
      label: "Dashboard",
      link: "dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "Người dùng",
      link: "users",
      icon: <PermIdentityIcon />,
    },
    { label: "Bài viết", link: "posts", icon: <ArticleIcon /> },
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
            to={item.link}
            className={cx("nav-links")}
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
