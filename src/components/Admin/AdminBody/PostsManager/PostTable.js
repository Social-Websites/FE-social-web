import PropTypes from "prop-types";
import { format, parseISO } from "date-fns";
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
import styles from "../UsersManager/UserModal.module.scss";

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
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => {
                //const isSelected = selected.includes(post._id);
                const createdAt = format(
                  parseISO(post.created_at),
                  "dd/MM/yyyy"
                );

                return (
                  <>
                    <TableRow
                      hover
                      key={post._id}
                      onDoubleClick={() =>
                        setVisible((prevState) => ({
                          ...prevState,
                          [post._id]: true,
                        }))
                      }
                    >
                      {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.id);
                          } else {
                            onDeselectOne?.(customer.id);
                          }
                        }}
                      />
                    </TableCell> */}
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Avatar src={post.creator.profile_picture}>
                            {getInitials(post.creator.username)}
                          </Avatar>
                          <Typography variant="subtitle2">
                            {post.creator.username}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          component="h6"
                          sx={{
                            opacity: post.content.length === 0 ? 0.6 : 1,
                          }}
                        >
                          {post.content.length > 25
                            ? post.content.substring(0, 25) + "..."
                            : post.content || "No title"}
                        </Typography>
                      </TableCell>
                      <TableCell>{post.reacts_count}</TableCell>
                      <TableCell>{post.comments_count}</TableCell>
                      <TableCell>{createdAt}</TableCell>
                    </TableRow>

                    <Modal
                      show={visible[post._id]}
                      onHide={() =>
                        setVisible((prevState) => ({
                          ...prevState,
                          [post._id]: false,
                        }))
                      }
                      className={cx("add-employee-modal")}
                    >
                      <Modal.Header>
                        <div className={cx("title-modal")}>POST</div>
                      </Modal.Header>
                      <Modal.Body>
                        <div
                          className={cx(
                            "row align-items-center",
                            "modal-content-item"
                          )}
                        >
                          <div>
                            <div
                              className={cx(
                                "col-lg-3 col-md-3",
                                "heading-modal"
                              )}
                            >
                              <div>
                                {post.creator.username} {post.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <div
                          style={{
                            width: "70%",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <button
                            className={cx("modal-button")}
                            style={{
                              backgroundColor: "#ff0000",
                              border: "none",
                              color: "white",
                              borderRadius: "10px",
                            }}
                            onClick={() => setVisible(false)}
                          >
                            CLOSE
                          </button>
                          {/* <button
                            className={cx("modal-button")}
                            style={{
                              backgroundColor: "#1976d2",
                              border: "none",
                              color: "white",
                              borderRadius: "10px",
                            }}
                            onClick={handleAddUser}
                          >
                            ADD
                          </button> */}
                        </div>
                      </Modal.Footer>
                    </Modal>
                  </>
                );
              })}
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
