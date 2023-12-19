import React, {
    forwardRef
  } from "react";
  import classNames from "classnames/bind";
  import styles from "./GroupItem.module.scss";
 
  
  const cx = classNames.bind(styles);
  
  const GroupItem = forwardRef(({ group }) => {
  
    return (
      <>
        <div className={cx("group__info")}>
            <div className={cx("group__inf")}>
                <div className={cx("group__avatar")}>
                    <img src={group.groupImage} />
                </div>
                
                <span>{group.name}</span>
            </div>
            <div className={cx("group__btn")}>
                <button
                    className={cx("join__button")}
                >
                    <span>Join group</span>
                </button>
            </div>
        </div>
    </>
    );
  });
  
  export default GroupItem;
  