import React from 'react';
import { useState } from 'react';
import {initjson} from "../initdata";

export const UserContext = React.createContext(null);

export const UserContextProvider = ({ children }) => {
  const [contextValue, setContextValue] = useState({ user: {name: "Guest"}} );

  const updateContextValue = (newValue) => {
    setContextValue(newValue);
  };

  return (
    <UserContext.Provider value={{ contextValue, updateContextValue }}>
      {children}
    </UserContext.Provider>
  );
};

//loads all user data from local storage and performs a fallback to defaults if none
export function loadAllUserData() {
  return JSON.parse( localStorage.getItem('users') || initjson );
}

export function saveAllUserData( data ) {
  localStorage.setItem('users', JSON.stringify(data) );
} 


export function logIn( user ) {
  localStorage.setItem('loggedInUserId', user.id)
}


export function initUserDataOnCreate( user ) {
  user.balance = 400 + Math.round( Math.random()*100 );
}
