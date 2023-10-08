import React from 'react';

import styles from './Card.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Card = props => {
  return (
    <div className={cx("card", props.className)} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
