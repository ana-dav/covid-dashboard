import { createContext } from "react";

const CountryNameContext = createContext(null);
const CountryCasesContext = createContext(null);
const CountryRecoveredContext = createContext(null);
const CountryDeathsContext = createContext(null);
const Global = createContext(true);

export {
  CountryNameContext,
  CountryCasesContext,
  CountryRecoveredContext,
  CountryDeathsContext,
  Global,
};
