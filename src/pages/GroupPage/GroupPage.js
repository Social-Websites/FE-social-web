import React, { useState, useCallback, useEffect } from "react";
import GroupItem from "../../components/GroupItem";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import SearchGroupLoading from "../../components/SearchGroupLoading";
import classNames from "classnames/bind";
import styles from "./GroupPage.module.scss";
import Sidenav from "../../shared/components/NavBar";
import GroupInvited from "../../components/GroupInvited";
import CloseIcon from "@mui/icons-material/Close";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import {
  getAdminGroups,
  getMemberGroups,
  getInvitedGroups,
  createGroup,
  searchGroups,
} from "../../services/groupService";

const cx = classNames.bind(styles);

function GroupPage() {
  const privateHttpRequest = usePrivateHttpClient();
  const [createModal, setCreateModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [searchedGroups, setSearchedGroups] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [adminGroups, setAdminGroups] = useState([]);
  const [memberGroups, setMemberGroups] = useState([]);
  const [invitedGroups, setInvitedGroups] = useState([]);
  const toggleCreate = () => {
    setCreateModal(!createModal);
    if (!createModal) {
      if (document.body.style.overflow !== "hidden")
        document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const getAdminGroup = useCallback(async () => {
    try {
      const data = await getAdminGroups(privateHttpRequest.privateRequest);
      setAdminGroups(data.groups);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getMemberGroup = useCallback(async () => {
    try {
      const data = await getMemberGroups(privateHttpRequest.privateRequest);
      setMemberGroups(data.groups);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getInvitedGroup = useCallback(async () => {
    try {
      const data = await getInvitedGroups(privateHttpRequest.privateRequest);
      setInvitedGroups(data.groups);
    } catch (err) {
      console.error(err);
    }
  }, []);
  useEffect(() => {
    getAdminGroup();
    getMemberGroup();
    getInvitedGroup();
  }, []);

  const handleCreateGroup = async () => {
    setCreatingGroup(true);
    try {
      const respone = await createGroup(
        {
          name: name,
          description: bio,
          cover: "/static-resources/default-cover.jpg",
        },
        privateHttpRequest.privateRequest
      );
      if (respone !== null) {
        setAdminGroups((prev) => [...prev, respone]);
        setCreatingGroup(false);
        toggleCreate();
      }
    } catch (err) {
      console.error(err);
      setCreatingGroup(false);
      toggleCreate();
    }
  };

  const searchGroup = async (e) => {
    const data = e.target.value;
    if (data == "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
    try {
      const result = await searchGroups(
        data,
        privateHttpRequest.privateRequest
      );
      console.log(result);
      if (result !== null) {
        setSearchedGroups(result);
      }
      setIsLoadingSearch(false);
    } catch (err) {
      setIsLoadingSearch(false);
      console.log(err);
    }
  };
  const debounce = (fn, delay) => {
    let timerId = null;

    return function (...args) {
      setIsLoadingSearch(true);
      clearTimeout(timerId);

      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };
  const debouncedSearchGroups = debounce(searchGroup, 500);

  return (
    <div
      className={cx("group")}
      style={{ backgroundColor: "black", height: "100%" }}
    >
      <div className={cx("group__navWraper")}>
        <Sidenav />
      </div>
      <div className={cx("group__right")}>
        <div className={cx("group__content")}>
          <div className={cx("group__header")}>
            <div className={cx("group__input")}>
              <input
                type="text"
                onChange={debouncedSearchGroups}
                placeholder="Search groups...."
              />
            </div>
            <div className={cx("group__button")}>
              <button
                onClick={toggleModal}
                style={{ marginRight: "10px" }}
                className={cx("create__button")}
              >
                <span>Invitation</span>
              </button>
              <button onClick={toggleCreate} className={cx("create__button")}>
                <span>+ Create</span>
              </button>
            </div>
          </div>
          {isSearching &&
            (isLoadingSearch ? (
              <div className={cx("groups")}>
                <SearchGroupLoading />
              </div>
            ) : searchedGroups.length > 0 ? (
              <div className={cx("groups")}>
                <div style={{ width: "90%", paddingBottom: "20px" }}>
                  <div className={cx("group__items_header")}>Results</div>
                  <div className={cx("group__items")}>
                    {searchedGroups?.map((group) => (
                      <GroupItem key={group._id} group={group} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={cx("groups")}>
                <span
                  style={{
                    color: "#A8A8A8",
                    padding: "20px",
                    fontSize: "15px",
                    fontWeight: 500,
                    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Helvetica, Arial, sans-serif`,
                  }}
                >
                  No search results
                </span>
              </div>
            ))}

          {!isSearching &&
            (adminGroups?.length > 0 || memberGroups?.length > 0 ? (
              <div>
                {adminGroups.length > 0 && (
                  <div className={cx("groups")}>
                    <div
                      style={
                        memberGroups?.length > 0
                          ? {
                              width: "90%",
                              paddingBottom: "20px",
                              borderBottom: "#212121 solid 1px",
                            }
                          : { width: "90%", paddingBottom: "20px" }
                      }
                    >
                      <div className={cx("group__items_header")}>
                        Your groups
                      </div>
                      <div className={cx("group__items")}>
                        {adminGroups?.map((group) => (
                          <GroupItem key={group._id} group={group} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {memberGroups?.length > 0 && (
                  <div className={cx("groups")}>
                    <div style={{ width: "90%", paddingBottom: "20px" }}>
                      <div className={cx("group__items_header")}>
                        All groups you have joined
                      </div>
                      <div className={cx("group__items")}>
                        {memberGroups?.map((group) => (
                          <GroupItem group={group} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={cx("groups")}>
                <span
                  style={{
                    color: "#A8A8A8",
                    padding: "20px",
                    fontSize: "15px",
                    fontWeight: 500,
                    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Helvetica, Arial, sans-serif`,
                  }}
                >
                  You haven't joined the groups yet.
                </span>
              </div>
            ))}
        </div>
      </div>
      {createModal && (
        <div className={cx("group-modal active-group-modal")}>
          <div
            onClick={toggleCreate}
            className={cx("group-overlay")}
            style={{ alignSelf: "flex-end" }}
          >
            <CloseIcon
              className={cx("sidenav__icon")}
              style={{
                width: "27px",
                height: "27px",
                color: "white",
                margin: "12px 30px",
                position: "absolute",
                right: "0",
                cursor: "pointer",
              }}
            />
          </div>
          <div className={cx("more-content")}>
            <div className={cx("more-content-header")}>
              <div className={cx("more-content-title")}>Create Group</div>
            </div>
            <div className={cx("more-content-info")}>
              <div className={cx("group__content__info")}>
                <div className={cx("group__content__info__subject")}>
                  <span>Name</span>
                </div>
                <div className={cx("group__content__info__textarea")}>
                  <input
                    style={{ height: "20px", overflow: "none" }}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    placeholder="Name..."
                  ></input>
                </div>
              </div>
              <div className={cx("group__content__info")}>
                <div className={cx("group__content__info__subject")}>
                  <span>Bio</span>
                </div>
                <div className={cx("group__content__info__textarea")}>
                  <textarea
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
                    placeholder="Bio..."
                  ></textarea>
                </div>
              </div>
              <div className={cx("group__content__info")}>
                <div className={cx("group__content__info__subject")}>
                  <span></span>
                </div>
                <div
                  className={cx("group__content__info__button")}
                  style={{
                    position: "relative",
                  }}
                >
                  {creatingGroup ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "white",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-8px",
                      }}
                    />
                  ) : (
                    <Button
                      sx={{
                        fontFamily: "inherit",
                        textTransform: "none",
                        ":hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={handleCreateGroup}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {modal && (
        <div className={cx("group-modal active-group-modal")}>
          <div
            onClick={toggleModal}
            className={cx("group-overlay")}
            style={{ alignSelf: "flex-end" }}
          >
            <CloseIcon
              className={cx("sidenav__icon")}
              style={{
                width: "27px",
                height: "27px",
                color: "white",
                margin: "12px 30px",
                position: "absolute",
                right: "0",
                cursor: "pointer",
              }}
            />
          </div>
          <div className={cx("more-content")}>
            <div className={cx("more-content-header")}>
              <div className={cx("more-content-title")}>Groups Invited</div>
            </div>
            <div className={cx("group-modal-content")}>
              {invitedGroups.map((group) => {
                console.log(group);
                return <GroupInvited group={group} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupPage;
