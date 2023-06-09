import React, {useEffect, useReducer, createContext, useContext } from "react";

const ApiContext = createContext();

const initialState = {
  loading: false,
  done: false,
  error: null,
  data: null,
  apiUrl: ''
}


const reducer = (state, action) => {
  switch( action.type ) {
    case 'FETCH_START':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, done: true, data: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SET_API_URL':
      return { ...state, apiUrl: action.payload }
    default:
      return state;
  }
}


const ApiConnector = ( {children} ) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect( () => {
    const fetchData = async() => {
      dispatch( {type: 'FETCH_START'} );

      try {
        const response = await fetch(state.apiUrl);
        const data = await response.json();
        dispatch( {type: 'FETCH_SUCCESS', payload: data} );
      }
      catch (error) {
        dispatch( {type: 'FETCH_ERROR', payload: error.code } );
      }
    }

    fetchData();
  }, [state.apiUrl]);

  const setApiUrl = (url) => {
    dispatch( {type: 'SET_API_URL', payload: url} );
  }

  return (
    <ApiContext.Provider value={ {state, setApiUrl} }>
      {children}
    </ApiContext.Provider>
  )

} 