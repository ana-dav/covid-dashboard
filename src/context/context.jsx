import React, { useReducer } from "react";

const initialState = {
    start: true,

  };

  const reducer = (state, action) => {}

  const MainProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
         <MainContext.Provider
            value={{
            start: state.start

            }}
        >
            {children}
        </MainContext.Provider>
    )
  }

  export default MainProvider;