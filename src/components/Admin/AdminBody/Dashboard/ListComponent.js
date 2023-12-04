import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import post from "../../../../../../BE-social-web/models/post";

const ListComponent = ({ users, posts }) => {
  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={5}>
          <Paper>
            <List>
              <ListItem>
                <Typography>Lastest Users</Typography>
              </ListItem>
              <Divider />
              {users.length === 0 ? (
                <Box
                  sx={{
                    minHeight: "250px",
                    display: "flex",
                    flexFlow: "row wrap",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography align="center">
                    <CircularProgress />
                  </Typography>
                </Box>
              ) : (
                users.map((item, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <Avatar src={item.profile_picture} alt={""}></Avatar>
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="body1" component="h6">
                        {item.username}
                      </Typography>
                      <Typography variant="body1" component="h6">
                        {item.full_name}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={7}>
          <Paper>
            <List>
              <ListItem>
                <Typography>Lastest Posts</Typography>
              </ListItem>
              <Divider />
              {posts.length === 0 ? (
                <Box
                  sx={{
                    minHeight: "250px",
                    display: "flex",
                    flexFlow: "row wrap",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography align="center">
                    <CircularProgress />
                  </Typography>
                </Box>
              ) : (
                posts.map((item, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <Avatar
                        src={item.creator.profile_picture}
                        alt={""}
                      ></Avatar>
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="body1" component="h6">
                        {item.content}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListComponent;
