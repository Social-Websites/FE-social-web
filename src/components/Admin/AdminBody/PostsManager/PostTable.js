import PropTypes from "prop-types";
import { format, parseISO } from "date-fns";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Alert,
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "./ScrollBar";
import { getInitials } from "../../../../shared/util/get-initials";
import { useMemo, useState } from "react";
import { applyPagination } from "../../../../shared/util/apply-pagination";
import Modal from "react-bootstrap/Modal";
import classNames from "classnames/bind";
import styles from "./PostManager.module.scss";
import PostTableItem from "./PostTableItem";

const cx = classNames.bind(styles);

const usePosts = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const usePostIds = (posts) => {
  return useMemo(() => {
    return posts.map((post) => post.id);
  }, [posts]);
};

export const PostTable = (props) => {
  const {
    count = 0,
    data = [],

    onPageChange = () => {},
    onRowsPerPageChange,

    page = 0,
    rowsPerPage = 0,
    //selected = [],
  } = props;
  const [visible, setVisible] = useState({});

  const posts = usePosts(data, page, rowsPerPage);
  const postsIds = usePostIds(posts);
  // const postsSelection = useSelection(postsIds);
  // const onDeselectAll = postsSelection.handleDeselectAll;
  // const onDeselectOne = postsSelection.handleDeselectOne;
  // const onSelectAll = postsSelection.handleSelectAll;
  // const onSelectOne = postsSelection.handleSelectOne;

  // const selectedSome = selected.length > 0 && selected.length < items.length;
  // const selectedAll = items.length > 0 && selected.length === items.length;

  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isLastImage, setIsLastImage] = useState(false);

  function showNextImage() {
    setImageIndex((index) => {
      if (index === images.length - 2) {
        setIsLastImage(true);
        setIsFirstImage(false);
        return images.length - 1;
      } else {
        setIsLastImage(false);
        setIsFirstImage(false);
        return index + 1;
      }
    });
  }

  function showPrevImage() {
    setImageIndex((index) => {
      if (index === 1) {
        setIsLastImage(false);
        setIsFirstImage(true);
        console.log(index);
        return 0;
      } else {
        setIsLastImage(false);
        setIsFirstImage(false);
        console.log(index);
        return index - 1;
      }
    });
  }

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
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
                </TableCell> */}
                <TableCell>Author</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Likes</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reports</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <PostTableItem key={post._id} post={post} />
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

PostTable.propTypes = {
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
};
