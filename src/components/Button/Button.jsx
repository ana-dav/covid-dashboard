import React, { useState } from "react";
import PropTypes from "prop-types";
import expand from "../../assets/images/expand.svg";
import styles from "./Button.module.scss";

const Button = ({ btnMargin, onClick }) => {
  const [margin] = useState(btnMargin);

  return (
    <button
      type="button"
      className={styles.resizeButton}
      onClick={onClick}
      style={{ margin }}>
    <img className={styles.expand} src={expand} alt="expand" />
    </button>
  );
};

Button.propTypes = {
  btnMargin: PropTypes.string.isRequired,
  onClick: PropTypes.number.isRequired,
};

export default Button;
