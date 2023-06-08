import React from 'react';
import { useState } from 'react';

export const emptyContext = { user: {name: null} };

export const UserContext = React.createContext(null);

export const UserContextProvider = ({ children }) => {
  const [contextValue, setContextValue] = useState( emptyContext );

  const updateContextValue = (newValue) => {
    setContextValue(newValue);
  };

  return (
    <UserContext.Provider value={{ contextValue, updateContextValue }}>
      {children}
    </UserContext.Provider>
  );
};
