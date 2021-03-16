import React, { useState, useContext } from 'react';
import { worldPopulation } from '../../constants/constants';
import {
  CountryNameContext,
  CountryCasesContext,
  CountryRecoveredContext,
  CountryDeathsContext,
  Global,
} from '../../context/CountryContext';
import PeriodSwitcher from '../switchers/PeriodSwitcher/PeriodSwitcher';
import Button from '../Button/Button';
import TextSlider from '../TextSlider/TextSlider';
import ModelSwitcher from '../switchers/ModelSwitcher/ModelSwitcher';
import styles from './TotalTable.module.scss';

const TotalTable = (api) => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [period, setPeriod] = useState('totally');
  const [model, setModel] = useState('ABS');
  const [isFullScreen, setFullScreen] = useState(false);
  const [isResized, setResized] = useState(false);

  const totalTitles = ['cases', 'recovered', 'deaths'];
  const todayTitles = ['todayCases', 'todayRecovered', 'todayDeaths'];
  const titles = [totalTitles, todayTitles];
  const { countryName } = useContext(CountryNameContext);
  const { countryCases } = useContext(CountryCasesContext);
  const { countryRecovered } = useContext(CountryRecoveredContext);
  const { countryDeaths } = useContext(CountryDeathsContext);
  const { isGlobal } = useContext(Global);

  const resize = () => {
    setResized(true);
    return isFullScreen ? setFullScreen(false) : setFullScreen(true);
  };

  return (
    <div
      className={
        isResized && !isFullScreen
          ? styles.total__wrapper
          : isResized && isFullScreen
          ? styles.total__wrapper_full
          : styles.total__wrapper
      }>
      <Button margin="0" onClick={resize} />
      <div className={styles.slider__wrapper}>
        <table>
          <thead>
            <tr>
              <th>
                {countryName && !isGlobal
                  ? countryName
                  : `Global ${titles[0][sliderIndex]}`}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {countryName &&
                totalTitles[sliderIndex] === 'cases' &&
                !isGlobal
                  ? countryCases
                  : countryName &&
                    totalTitles[sliderIndex] === 'recovered' &&
                    !isGlobal
                  ? countryRecovered
                  : countryName &&
                    totalTitles[sliderIndex] === 'deaths' &&
                    !isGlobal
                  ? countryDeaths
                  : period === 'totally' && model === 'ABS'
                  ? api.data.data[titles[0][sliderIndex]]
                  : period === 'daily' && model === 'ABS'
                  ? api.data.data[titles[1][sliderIndex]]
                  : period === 'totally' && model === '100k'
                  ? Number.parseFloat(
                      (api.data.data[titles[0][sliderIndex]] /
                        worldPopulation) *
                        100000,
                    ).toFixed()
                  : Number.parseFloat(
                      (api.data.data[titles[1][sliderIndex]] /
                        worldPopulation) *
                        100000,
                    ).toFixed()}
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.switcher__wrapper}>
          <PeriodSwitcher onChange={(i) => setPeriod(i)} />
          <ModelSwitcher onChange={(i) => setModel(i)} />
        </div>
        <TextSlider onChange={(i) => setSliderIndex(i)} />
      </div>
    </div>
  );
};

export default TotalTable;
