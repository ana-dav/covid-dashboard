import React, { useState } from 'react';
import PropTypes from 'prop-types';
import leftArrow from '../../assets/images/left-arrow.png';
import rightArrow from '../../assets/images/right-arrow.png';
import styles from './TextSlider.module.scss';

const TextSlider = (props) => {
  const [current, setCurrent] = useState(0);
  const soughtsNames = ['cases', 'recovered', 'deaths'];
  let index = 0;

  const onChangeNextSought = () => {
    index = (current + 1) % soughtsNames.length;
    setCurrent(index);
    props.onChange(index);
  };

  const onChangePrevSought = () => {
    if (current === 0) {
      index = soughtsNames.length - 1;
    } else {
      index = current - 1;
    }
    setCurrent(index);
    props.onChange(index);
  };

  return (
    <div className={styles.slider}>
      <button
        type="button"
        className={styles.button}
        onClick={onChangePrevSought}>
        <img alt="left-arrow" src={leftArrow} className={styles.img} />
      </button>
      <span>{soughtsNames[current]}</span>
      <button
        type="button"
        className={styles.button}
        onClick={onChangeNextSought}>
        <img alt="right-arrow" src={rightArrow} className={styles.img} />
      </button>
    </div>
  );
};

TextSlider.propTypes = {
  onChange: PropTypes.number.isRequired,
};

export default TextSlider;
