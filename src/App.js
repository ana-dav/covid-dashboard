import React, { useState, useEffect, useMemo } from 'react';
import {
  TotalCases,
  GlobalPerCountry,
  Map,
  Chart,
  TotalTable,
} from './components';
import { fetchData, fetchCountryData, fetchDailyData } from './api';
import {
  CountryNameContext,
  CountryCasesContext,
  CountryRecoveredContext,
  CountryDeathsContext,
  Global,
} from './context/CountryContext';
import styles from './App.module.scss';

const App = () => {
  const [data, setData] = useState({});
  const [countryData, setCountryData] = useState({});
  const [dailyData, setDailyData] = useState({});
  const [countryName, setCountryName] = useState();
  const [countryCases, setCountryCases] = useState();
  const [countryRecovered, setCountryRecovered] = useState();
  const [countryDeaths, setCountryDeaths] = useState();
  const [isGlobal, setIsGlobal] = useState();
  const [isFetched, setFetched] = useState(false);

  const providerName = useMemo(
    () => ({
      countryName,
      setCountryName,
    }),
    [countryName, setCountryName],
  );
  const providerCases = useMemo(
    () => ({
      countryCases,
      setCountryCases,
    }),
    [countryCases, setCountryCases],
  );
  const providerRecovered = useMemo(
    () => ({
      countryRecovered,
      setCountryRecovered,
    }),
    [countryRecovered, setCountryRecovered],
  );
  const providerDeaths = useMemo(
    () => ({
      countryDeaths,
      setCountryDeaths,
    }),
    [countryDeaths, setCountryDeaths],
  );
  const providerIsGlobal = useMemo(
    () => ({
      isGlobal,
      setIsGlobal,
    }),
    [isGlobal, setIsGlobal],
  );

  useEffect(() => {
    async function getData() {
      const requestData = await fetchData();
      const requestCountryData = await fetchCountryData();
      const requestDailyData = await fetchDailyData();
      setData({ data: requestData });
      setCountryData({ countryData: requestCountryData });
      setDailyData({ dailyData: requestDailyData });
      setTimeout(() => setFetched(true), 1500);
    }
    getData();
  }, []);

  return !isFetched ? null : (
    <div className={styles.wrapper}>
      <CountryNameContext.Provider value={providerName}>
        <CountryCasesContext.Provider value={providerCases}>
          <CountryRecoveredContext.Provider value={providerRecovered}>
            <CountryDeathsContext.Provider value={providerDeaths}>
              <Global.Provider value={providerIsGlobal}>
                <div className={styles.wrapper__sheets_global}>
                  <div className={styles.wrapper__frame}>
                    <TotalCases data={data} />
                  </div>
                  <div className={styles.wrapper__frame}>
                    <GlobalPerCountry countryData={countryData} />
                  </div>
                </div>
                <div className={styles.wrapper__charts}>
                  <Map data={data} countryData={countryData} />
                  <Chart dailyData={dailyData} />
                </div>
                <div className={styles.wrapper__sheets_global}>
                  <div className={styles.wrapper__frame}>
                    <TotalTable data={data} />
                  </div>
                </div>
              </Global.Provider>
            </CountryDeathsContext.Provider>
          </CountryRecoveredContext.Provider>
        </CountryCasesContext.Provider>
      </CountryNameContext.Provider>
    </div>
  );
};

export default App;
