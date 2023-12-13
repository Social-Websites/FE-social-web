import PropTypes from "prop-types";
import {
  // Avatar,
  Box,
  Card,
  Checkbox,
  // Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  // Typography,
} from "@mui/material";
import { Scrollbar } from "./ScrollBar";
import { useMemo } from "react";
import { applyPagination } from "../../../../shared/util/apply-pagination";
import { useSelection } from "../../../../shared/hook/use-selection";
import UserTableItem from "./UserTableItem";

const useUsers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useUserIds = (users) => {
  return useMemo(() => {
    return users.map((user) => user._id);
  }, [users]);
};

export const UserTable = (props) => {
  const {
    count = 0,
    data = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    setUsersSelected,
    selected = [],
  } = props;

  const users = useUsers(data, page, rowsPerPage);
  const usersIds = useUserIds(users);
  const usersSelection = useSelection(usersIds, setUsersSelected);

  const onDeselectAll = usersSelection.handleDeselectAll;
  const onDeselectOne = usersSelection.handleDeselectOne;
  const onSelectAll = usersSelection.handleSelectAll;
  const onSelectOne = usersSelection.handleSelectOne;

  const selectedSome = selected.length > 0 && selected.length < users.length;
  const selectedAll = users.length > 0 && selected.length === users.length;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Fullname</TableCell>
                <TableCell>Signed Up</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reports</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <UserTableItem
                  key={user._id}
                  user={user}
                  onDeselectOne={onDeselectOne}
                  onSelectOne={onSelectOne}
                  selected={selected}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

UserTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  setUsersSelected: PropTypes.func,
};
