import request from 'superagent';

import {getRefreshToken, saveRefreshToken} from "../misc/tokenStorage";

console.log("Value of env SERVER_URL:", process.env.REACT_APP_API_URL);


const API_PATH = "/api/v1";


function apiMethodUrl( methodName ) {
  return process.env.REACT_APP_API_URL + API_PATH + methodName;
}



export function userHasBeenLoggedInBefore() {
  return getRefreshToken() !== null;
}


export const API_METHODS = {
  LOGIN_USER: {
    path: '/users/login',
    params: { //only mandatory parameters listed below
      email: null,
      password: null
    }
  },
  REFRESH_USER: {
    path: '/users/refresh',
    params: {
      RefreshToken: null
    }
  },
  ALL_USERS: {
    path: '/users',
    method: 'GET',
  },
  CREATE_USER: {
    path: '/users/create',
    params: {
      name: null,
      email: null,
      password: null
    }
  },
  LOGOUT: {
    path: '/users/logout',
    bearer: null
  },
  DEPOSIT: {
    path: '/users/deposit',
    bearer: null,
    params: {
      amount: null
    }
  },
  WITHDRAW: {
    path: '/users/withdraw',
    bearer: null,
    params: {
      amount: null
    }
  }
}


function genericCall( descriptor ) {
  const url = process.env.REACT_APP_API_URL + API_PATH + descriptor.path;
  const data = descriptor.params;
  console.log( "Sending through api: " + url, data);

  const req = descriptor.method === 'GET' ? request.get( url ) : request.post( url );
  if(descriptor.bearer) req.set('Authorization', "Bearer " + descriptor.bearer);

  if( checkNullFields(descriptor.params) ) {
    console.error('AllMandatoryFieldsNotSetError returning empty promise...');
    return new Promise( (resolve, reject) => {resolve();} );
  }
  return req.send( data );
}


function checkNullFields(obj) {
  for (const key in obj) {
    if (obj[key] === null) return true;
  }
  return false; // No null fields found
}







export function loginUser( email, password ) {
  const methodDescriptor = API_METHODS.LOGIN_USER;
  methodDescriptor.params.email = email;
  methodDescriptor.params.password = password;

  return genericCall( methodDescriptor ); 
}


export function refreshUser() {
  const methodDescriptor = API_METHODS.REFRESH_USER;
  methodDescriptor.params.RefreshToken = getRefreshToken();

  return genericCall( methodDescriptor ); 
}


export function allUsers() {
  const methodDescriptor = API_METHODS.ALL_USERS;
  return genericCall( methodDescriptor );
}


export function createUser( user ) {
  const methodDescriptor = API_METHODS.CREATE_USER;
  methodDescriptor.params = user;
  return genericCall( methodDescriptor );     
}


export function logout( bearer ) {
  const methodDescriptor = API_METHODS.LOGOUT;
  methodDescriptor.bearer = bearer;
  return genericCall( methodDescriptor );
}


export function deposit( bearer, amount ) {
  const descriptor = API_METHODS.DEPOSIT;
  descriptor.bearer = bearer;
  descriptor.params.amount = amount;

  return genericCall( descriptor );
}


export function withdraw( bearer, amount ) {
  const descriptor = API_METHODS.WITHDRAW;
  descriptor.bearer = bearer;
  descriptor.params.amount = amount;

  return genericCall( descriptor );
}