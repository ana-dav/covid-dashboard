export const initialState = {
  loading: true,
  countries: [],
  errorMessage: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_COUNTRIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case "SEARCH_COUNTRIES_SUCCESS":
      return {
        ...state,
        loading: false,
        countries: action.payload,
      };
    case "SEARCH_COUNTRIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error,
      };
    default:
      return state;
  }
};
