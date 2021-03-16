import React, { useState } from "react";
import PropTypes from "prop-types";
import Switch from "react-switch";
import { colors } from "../../../constants/constants";
import styles from "../Switcher.module.scss";

const ModelSwitcher = (props) => {
  const [model, setModel] = useState("ABS");
  const [checkedModel, setCheckedModel] = useState(false);
  const handleModelChange = (nextChecked) => {
    setCheckedModel(nextChecked);
    if (!checkedModel) {
      setModel("100k");
      props.onChange("100k");
    } else {
      setModel("ABS");
      props.onChange("ABS");
    }
  };

  return (
    <label>
      <Switch
        onChange={handleModelChange}
        checked={checkedModel}
        className={styles.switcher}
        onColor={colors.lightGray}
        offColor={colors.lightGray}
        onHandleColor={colors.gray}
        offHandleColor={colors.gray}
        width={80}
        uncheckedIcon={<div className={styles.toggler}>{model}</div>}
        checkedIcon={<div className={styles.toggler}>{model}</div>}
        uncheckedHandleIcon={<div className={styles.toggler} />}
        checkedHandleIcon={<div className={styles.toggler} />}
      />
    </label>
  );
};

ModelSwitcher.propTypes = {
  onChange: PropTypes.string.isRequired,
};

export default ModelSwitcher;
