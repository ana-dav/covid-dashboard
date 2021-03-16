import React, { useState, useEffect, useContext } from "react";
import { countriesAmount } from "../../constants/constants";
import {
  CountryNameContext,
  CountryCasesContext,
  CountryRecoveredContext,
  CountryDeathsContext,
  Global,
} from "../../context/CountryContext";
import Button from "../Button/Button";
import TextSlider from "../TextSlider/TextSlider";
import styles from "./GlobalPerCountry.module.scss";

const GlobalPerCountry = (api) => {
  const countryArray = new Array(countriesAmount).fill("");
  const [cases, setCases] = useState([]);
  const [recovered, setRecovered] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [country, setCountry] = useState([]);
  const [flag, setFlag] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [selectedLi, setSelectedLi] = useState();
  const [prev, setPrev] = useState();
  const [unsetBgColor, setUnsetBgColor] = useState();
  const [isFullScreen, setFullScreen] = useState(false);
  const [isResized, setResized] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");

  const { setCountryName } = useContext(CountryNameContext);
  const { setCountryCases } = useContext(CountryCasesContext);
  const { setCountryRecovered } = useContext(CountryRecoveredContext);
  const { setCountryDeaths } = useContext(CountryDeathsContext);
  const { setIsGlobal } = useContext(Global);

  useEffect(() => {
    setCases(api.countryData.countryData.map((data) => data.active));
    setRecovered(api.countryData.countryData.map((data) => data.recovered));
    setDeaths(api.countryData.countryData.map((data) => data.deaths));
    setCountry(api.countryData.countryData.map((data) => data.name));
    setFlag(api.countryData.countryData.map((data) => data.flag));

    if (searchCountry.length) {
      const commonIndex = [];
      setCountry(
        country.filter((singleCountry, index) => {
          const countriesTemp = singleCountry
            .toLowerCase()
            .match(searchCountry);
          if (countriesTemp) {
            commonIndex.push(index);
          }
          return countriesTemp;
        })
      );

      setFlag(
        flag.filter((singleFlag, index) => {
          let flagTemp;
          commonIndex.find((i) => {
            if (i === index) {
              flagTemp = singleFlag;
              return flagTemp;
            }
            return null;
          });
          return flagTemp;
        })
      );

      setCases(
        cases.filter((singleCase, index) => {
          let caseTemp;
          commonIndex.find((i) => {
            if (i === index) {
              caseTemp = singleCase;
              return caseTemp;
            }
            return null;
          });
          return caseTemp;
        })
      );

      setRecovered(
        recovered.filter((singleRecovered, index) => {
          let recoveredTemp;
          commonIndex.find((i) => {
            if (i === index) {
              recoveredTemp = singleRecovered;
              return recoveredTemp;
            }
            return null;
          });
          return recoveredTemp;
        })
      );

      setDeaths(
        deaths.filter((death, index) => {
          let deathTemp;
          commonIndex.find((i) => {
            if (i === index) {
              deathTemp = death;
              return deathTemp;
            }
            return null;
          });
          return deathTemp;
        })
      );
    }
  }, [api.countryData.countryData, searchCountry]);

  const handleCountryPicker = (index) => () => {
    setSelectedLi(index);
    setCountryName(country[index]);
    setCountryCases(cases[index]);
    setCountryRecovered(recovered[index]);
    setCountryDeaths(deaths[index]);
    setUnsetBgColor(false);
    setIsGlobal(false);
    if (prev === index) {
      setUnsetBgColor(true);
      setIsGlobal(true);
      setPrev(-1);
    } else {
      setPrev(index);
    }
  };

  const handleSearchInputChanges = (event) => {
    event.preventDefault();
    setSearchCountry(event.target.value);
  };

  const resize = () => {
    setResized(true);
    return isFullScreen ? setFullScreen(false) : setFullScreen(true);
  };

  return (
    <div
      className={
        isResized && !isFullScreen
          ? styles.container__regularSize
          : isResized && isFullScreen
          ? styles.container__fullSize
          : styles.container__regularSize
      }
    >
      <Button margin="0 0 0 320px" onClick={resize} />
      <input
        className={styles.search}
        type="text"
        placeholder="Enter country"
        onChange={handleSearchInputChanges}
        value={searchCountry}
      />
      <div className={styles.table}>
        <ul className={styles.list__countries}>
          {countryArray.map((value, index) => (
            <li
              className={styles.list__countries_item}
              key={value.id}
              onClick={handleCountryPicker(index)}
              role="presentation"
              tabIndex={index}
              style={{
                backgroundColor:
                  selectedLi === index && unsetBgColor
                    ? ""
                    : selectedLi === index
                    ? "black"
                    : "",
              }}
            >
              <div className={styles.wrapper}>
                <img src={flag[index]} alt="" />
                <p>{country[index]}</p>
                <p>
                  {sliderIndex === 0
                    ? cases[index]
                    : sliderIndex === 1
                    ? recovered[index]
                    : deaths[index]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.slider__wrapper}>
        <TextSlider onChange={(i) => setSliderIndex(i)} />
      </div>
    </div>
  );
};

export default GlobalPerCountry;
