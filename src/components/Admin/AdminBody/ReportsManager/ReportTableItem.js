import { format, parseISO } from "date-fns";
import {
  Avatar,
  Checkbox,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import { getInitials } from "../../../../shared/util/get-initials";

const ReportTableItem = (props) => {
  const { user, onDeselectOne, onSelectOne, selected = [] } = props;

  const isSelected = selected.includes(user._id);
  const createdAt = format(parseISO(user.created_at), "dd/MM/yyyy");

  return (
    <TableRow hover key={user._id} selected={isSelected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected}
          onChange={(event) => {
            if (event.target.checked) {
              onSelectOne?.(user._id);
            } else {
              onDeselectOne?.(user._id);
            }
          }}
        />
      </TableCell>
      <TableCell>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Avatar src={user.profile_picture}>
            {getInitials(user.username)}
          </Avatar>
          <Typography variant="subtitle2">{user.username}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{user.user_info.email}</TableCell>
      <TableCell>{user.full_name}</TableCell>
      <TableCell>{createdAt}</TableCell>
      <TableCell style={{ color: user.banned ? "red" : "green" }}>
        {user.banned ? "BANNED" : "ACTIVE"}
      </TableCell>
    </TableRow>
  );
};

export default ReportTableItem;
