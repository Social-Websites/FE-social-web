import SearchIcon from '@mui/icons-material/Search';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const UserSearch = () => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search...."
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            // fontSize="small"
          >
            <SearchIcon />
          </SvgIcon>
        </InputAdornment>
      )}
    />
  </Card>
);