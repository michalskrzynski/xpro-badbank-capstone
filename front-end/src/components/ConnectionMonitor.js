import React, {useEffect, useReducer, createContext } from "react";

export const ConnectionMonitorContext = createContext();

const initialState = {
  loading: false,
  done: false,
  error: null,
  data: null,
  apiPromise: null
}


const reducer = (state, action) => {
  switch( action.type ) {
    case 'FETCH_START':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, done: true, data: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SET_API_PROMISE':
      return { ...state, apiPromise: action.payload }
    default:
      return state;
  }
}


export default function ConnectionMonitor( {children} ) {

  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("STATE: ", state );

  useEffect( () => {
    const fetchData = async() => {
      if( state.apiPromise === null ) return;

      dispatch( {type: 'FETCH_START'} );

      state.apiPromise
        .then( response => {
          dispatch( {type: 'FETCH_SUCCESS', payload: response} )
        })
        .catch( error => {
          dispatch( {type: 'FETCH_ERROR', payload: error.code } )
        } );
    }

    fetchData();
  }, [state.apiPromise]);

  const setApiPromise = (url) => {
    dispatch( {type: 'SET_API_PROMISE', payload: url} );
  }

  return (
    <ConnectionMonitorContext.Provider value={ {state, setApiPromise} }>
      {children}
    </ConnectionMonitorContext.Provider>
  )

} 