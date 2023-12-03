import { Avatar, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Suggestions.scss";
import usePrivateHttpClient from "../../shared/hook/http-hook/private-http-hook";
import { getSuggestedUsers, sendAddFriend } from "../../services/userService";
import SuggestedUser from "./SuggestedUser";

const cx = classNames.bind(styles);

function Suggestions() {
  const privateHttpRequest = usePrivateHttpClient();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [suggestedUsersLoading, setSuggestedUsersLoading] = useState(false);

  useEffect(() => {
    const getSuggestion = async () => {
      setSuggestedUsersLoading(true);
      try {
        const data = await getSuggestedUsers(privateHttpRequest.privateRequest);

        if (data) setSuggestedUsers(data.suggested_users);
        setSuggestedUsersLoading(false);
      } catch (err) {
        setSuggestedUsersLoading(false);
        console.error("Lỗi suggestion", err);
      }
    };

    if (suggestedUsers.length === 0) getSuggestion();
  }, []);

  return (
    <div className={cx("suggestions")}>
      <div className={cx("suggestions__title")}>Suggestions for you</div>
      <div className={cx("suggestions__usernames")}>
        {suggestedUsersLoading ? (
          <CircularProgress size={40} />
        ) : (
          suggestedUsers.length > 0 &&
          suggestedUsers.map((user, i) => <SuggestedUser key={i} user={user} />)
        )}
      </div>
    </div>
  );
}

export default Suggestions;
