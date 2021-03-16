import axios from "axios";
import { urls } from "../constants/constants";

export const fetchData = async () => {
  try {
    const {
      data: {
        cases,
        recovered,
        deaths,
        todayCases,
        todayRecovered,
        todayDeaths,
      },
    } = await axios.get(urls.globalUrl);
    return {
      cases,
      recovered,
      deaths,
      todayCases,
      todayRecovered,
      todayDeaths,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchCountryData = async () => {
  try {
    const { data } = await axios.get(urls.countriesUrl);

    const modifiedData = data.map((countryData) => ({
      id: countryData.countryInfo.iso2,
      name: countryData.country,
      flag: countryData.countryInfo.flag,
      active: countryData.cases,
      recovered: countryData.recovered,
      deaths: countryData.deaths,
    }));
    return modifiedData;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchDailyData = async () => {
  try {
    const { data } = await axios.get(urls.dailyAllUrl);
    const modifiedData = data.map((dailyData) => ({
      active: dailyData.totalConfirmed,
      deaths: dailyData.deaths.total,
      recovered: dailyData.recovered.total,
      date: dailyData.reportDate,
    }));
    return modifiedData;
  } catch (error) {
    throw new Error(error);
  }
};
