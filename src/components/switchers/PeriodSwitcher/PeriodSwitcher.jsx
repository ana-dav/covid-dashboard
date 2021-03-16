import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import { colors } from '../../../constants/constants';
import styles from '../Switcher.module.scss';

const PeriodSwitcher = (props) => {
  const [period, setPeriod] = useState('Totally');
  const [checkedPeriod, setCheckedPeriod] = useState(false);
  const handlePeriodChange = (nextChecked) => {
    setCheckedPeriod(nextChecked);
    if (!checkedPeriod) {
      setPeriod('Daily');
      props.onChange('daily');
    } else {
      setPeriod('Totally');
      props.onChange('totally');
    }
  };

  return (
    <label>
      <Switch
        onChange={handlePeriodChange}
        checked={checkedPeriod}
        className={styles.switcher}
        onColor={colors.lightGray}
        offColor={colors.lightGray}
        onHandleColor={colors.gray}
        offHandleColor={colors.gray}
        width={80}
        boxShadow="1px 1px 5px rgba(0, 0, 0, 0.6)"
        uncheckedIcon={<div className={styles.toggler}>{period}</div>}
        checkedIcon={<div className={styles.toggler}>{period}</div>}
        uncheckedHandleIcon={<div className={styles.toggler} />}
        checkedHandleIcon={<div className={styles.toggler} />}
      />
    </label>
  );
};

PeriodSwitcher.propTypes = {
  onChange: PropTypes.string.isRequired,
};

export default PeriodSwitcher;
