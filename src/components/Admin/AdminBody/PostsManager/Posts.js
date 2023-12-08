import { React, useCallback, useEffect, useContext, useState } from "react";
import { subDays, subHours } from "date-fns";
import VerticalAlignBottomOutlinedIcon from "@mui/icons-material/VerticalAlignBottomOutlined";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { PostSearch } from "./PostSeach";
import { PostTable } from "./PostTable";
import { applyPagination } from "../../../../shared/util/apply-pagination";
import { useSelection } from "../../../../shared/hook/use-selection";
import { getAdminPosts } from "../../../../services/adminServices";
import usePrivateHttpClient from "../../../../shared/hook/http-hook/private-http-hook";
import { StateContext } from "../../../../context/StateContext";
import { io } from "socket.io-client";

const now = new Date();

const PostsManage = () => {
  const privateHttpRequest = usePrivateHttpClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [fetchPage, setFetchPage] = useState(1);
  const { user, socket, dispatch } = useContext(StateContext);

  useEffect(() => {
    if (user) {
      if(!socket) {
        socket.current = io("https://nestme-server.onrender.com");
        // console.log(socket);
        socket.current.on("connect", () => {
          // yêu cầu kết nối vào 1 socket mới
          console.log(`You connected with socket`, Date().split("G")[0]);
        }); // sự kiện mở kết nối socket
        socket.current.emit("add-user", user._id);
        dispatch({ type: "SET_SOCKET", payload: socket });
      }
    }
  }, [user]);
  //const [postsSelected, setPostsSelected] = useState([]);

  const getData = useCallback(async () => {
    const response = await getAdminPosts(
      fetchPage,
      500,
      privateHttpRequest.privateRequest,
      search
    );
    if (response) {
      if (fetchPage === 1) setData(response.posts);
      else setData((prev) => [...prev, ...response.posts]);
    }
  }, [fetchPage, search]);

  useEffect(() => {
    getData();
  }, [fetchPage, search]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Posts</Typography>
                {/* <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <VerticalAlignBottomOutlinedIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack> */}
              </Stack>
            </Stack>
            <PostSearch setSearch={setSearch} />
            {data.length > 0 && (
              <PostTable
                count={data.length}
                data={data}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                //selected={postsSelected}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default PostsManage;
