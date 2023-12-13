import { React, useCallback, useEffect, useState } from "react";
// import { subDays, subHours } from "date-fns";
// import VerticalAlignBottomOutlinedIcon from "@mui/icons-material/VerticalAlignBottomOutlined";
// import AddIcon from "@mui/icons-material/Add";
// import BlockIcon from "@mui/icons-material/Block";
// import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  // Alert,
  Box,
  // Button,
  Container,
  Stack,
  // SvgIcon,
  Typography,
} from "@mui/material";
import { ReportSearch } from "./ReportSeach";
import { ReportTable } from "./ReportTable";

import {
  // banUsers,
  // createUser,
  getAdminUsers,
  // unBanUsers,
} from "../../../../services/adminServices";
import usePrivateHttpClient from "../../../../shared/hook/http-hook/private-http-hook";

// const now = new Date();

const ReportsManage = () => {
  const privateHttpRequest = usePrivateHttpClient();

  // const [visible, setVisible] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [fetchPage, setFetchPage] = useState(1);

  const [usersSelected, setUsersSelected] = useState([]);
  // const [modalData, setModalData] = useState({
  //   email: "",
  //   fullname: "",
  //   username: "",
  //   password: "",
  //   admin: true,
  // });

  // const changeHandler = (e) => {
  //   setModalData((prev) => ({
  //     ...prev,
  //     [e.target.id]: e.target.value,
  //   }));
  // };

  const getData = useCallback(async () => {
    const response = await getAdminUsers(
      fetchPage,
      500,
      privateHttpRequest.privateRequest,
      search
    );
    if (response) {
      if (fetchPage === 1) setData(response.users);
      else setData((prev) => [...prev, ...response.users]);
    }
  }, [fetchPage, search]);

  useEffect(() => {
    getData();
  }, [fetchPage, search]);

  // useEffect(() => {}, [data]);

  // const handleBanUsers = async () => {
  //   const selectedIds = [...usersSelected]; // Sao chép usersSelected vào một mảng tạm thời
  //   setUsersSelected([]);

  //   setData((prev) => []);

  //   try {
  //     const banPromises = selectedIds.map((id) =>
  //       banUsers(id, privateHttpRequest.privateRequest)
  //     );

  //     const responses = await Promise.all(banPromises);

  //     if (responses) await getData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const handleUnBanUsers = async () => {
  //   const selectedIds = [...usersSelected]; // Sao chép usersSelected vào một mảng tạm thời

  //   setUsersSelected([]);

  //   setData((prev) => []);

  //   try {
  //     const unBanPromises = selectedIds.map((id) =>
  //       unBanUsers(id, privateHttpRequest.privateRequest)
  //     );

  //     const responses = await Promise.all(unBanPromises);

  //     if (responses) await getData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const handleAddUser = async () => {
  //   privateHttpRequest.clearError();
  //   try {
  //     const response = await createUser(
  //       modalData,
  //       privateHttpRequest.privateRequest
  //     );

  //     if (response) {
  //       setVisible(false);
  //       setModalData({
  //         email: "",
  //         fullname: "",
  //         username: "",
  //         password: "",
  //         admin: true,
  //       });
  //       getData();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Reports</Typography>
                {/* <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <VerticalAlignBottomOutlinedIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack> */}
              </Stack>
            </Stack>
            <ReportSearch setSearch={setSearch} />
            {data.length > 0 && !privateHttpRequest.isLoading && (
              <ReportTable
                count={data.length}
                data={data}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                setUsersSelected={setUsersSelected}
                selected={usersSelected}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ReportsManage;
