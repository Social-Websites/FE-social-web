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
                      <div className={cx("post-image")}>
                        <div
                          className={cx("image")}
                          style={{
                            maxHeight: "300px",
                            width: "100%",
                            display: "flex",
                            overflow: "hidden",
                          }}
                        >
                          {/* {images.map((image, index) => ( */}
                            <div
                              className={cx("img-slider")}
                              style={{
                                width: "100%",
                                transform: `translateX(-${100 * imageIndex}%)`,
                                transition: "transform 0.2s",
                                display: "flex",
                                flexShrink: "0",
                                flexGrow: "0",
                                borderRadius: "0px 0px 10px 10px",
                              }}
                              // aria-hidden={imageIndex !== index}
                            >
                              <img
                                style={{
                                  width: "100%",
                                  objectFit: "contain",
                                  height: "auto",
                                  display: "block",
                                  flexShrink: "0",
                                  flexGrow: "0",
                                  borderRadius: "0px 0px 0px 10px",
                                }}
                                src="data:image/jpeg;base64,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"
                                // src={image.url}
                                // alt={image.name}
                              />
                              {/* {isFirstImage === true || images.length === 1 ? null : ( */}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <button
                                    onClick={showPrevImage}
                                    className={cx("img-slider-btn")}
                                    style={{ left: 10 }}
                                    aria-label="View Previous Image"
                                  >
                                    <ArrowBackIosNewIcon
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        marginBottom: "2px",
                                      }}
                                      aria-hidden
                                    />
                                  </button>
                                </div>
                              {/* )} */}
                              {isLastImage === true ? null : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <button
                                    onClick={showNextImage}
                                    className={cx("img-slider-btn")}
                                    style={{ right: 10 }}
                                    aria-label="View Next Image"
                                  >
                                    <ArrowForwardIosIcon
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        marginBottom: "2px",
                                      }}
                                      aria-hidden
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                           {/* ))} */}
                        </div>
                      </div>
                      <div
                        className={cx(
                          "row align-items-center",
                          "modal-content-item"
                        )}
                      >
                          <div
                            className={cx(
                              "col-lg-3 col-md-3",
                              "post-info"
                            )}
                          >
                            <div style={{fontWeight: 600, marginRight: "10px"}}>
                                {post.creator.username} 
                            </div>
                            <div> {post.content}</div>
                          </div>
                      </div>
                      <div
                        className={cx(
                          "row align-items-center",
                          "modal-content-item"
                        )}
                      >
                        List Comments
                        <div className={cx(
                              "comment"
                            )}>
                          <div
                            className={cx(
                              "col-lg-3 col-md-3",
                              "post-comment"
                            )}
                          >
                            <div style={{fontWeight: 600, marginRight: "10px"}}>
                                {post.creator.username} 
                            </div>
                            <div> {post.content}</div>
                          </div>
                          <div
                            className={cx(
                              "col-lg-3 col-md-3",
                              "post-info"
                            )}
                          >
                            <div style={{fontWeight: 600, marginRight: "10px"}}>
                                {post.creator.username} 
                            </div>
                            <div> {post.content}</div>
                          </div>
                          <div
                            className={cx(
                              "col-lg-3 col-md-3",
                              "post-info"
                            )}
                          >
                            <div style={{fontWeight: 600, marginRight: "10px"}}>
                                {post.creator.username} 
                            </div>
                            <div> {post.content}</div>
                          </div>
                          <div
                            className={cx(
                              "col-lg-3 col-md-3",
                              "post-info"
                            )}
                          >
                            <div style={{fontWeight: 600, marginRight: "10px"}}>
                                {post.creator.username} 
                            </div>
                            <div> {post.content}</div>
                          </div>
                          <div
                            className={cx(
                              "col-lg-3 col-md-3",
                              "post-info"
                            )}
                          >
                            <div style={{fontWeight: 600, marginRight: "10px"}}>
                                {post.creator.username} 
                            </div>
                            <div> {post.content}</div>
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
                          <button
                            className={cx("modal-button")}
                            style={{
                              backgroundColor: "#1976d2",
                              border: "none",
                              color: "white",
                              borderRadius: "10px",
                            }}
                            onClick={() => {}}
                          >
                            HIDE
                          </button>
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
