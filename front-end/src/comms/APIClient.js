import request from 'superagent';

import { getRefreshToken, saveRefreshToken } from "../misc/tokenStorage";


const SERVER_URL = process.env.REACT_APP_API_URL || "https://www.michal-skrzynskifullstackbankingapplication.com";
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
  },
  WIRE_TRANSFER: {
    path: '/users/wire-transfer',
    bearer: null,
    params: {
      receiver: null,
      receiverAccount: null,
      amount: null
    }
  }
}


function genericCall( descriptor ) {
  const url = SERVER_URL + API_PATH + descriptor.path;
  const data = descriptor.params;
  console.log( "Sending through api: " + url, data);

  const req = descriptor.method === 'GET' ? request.get( url ) : request.post( url );
  if(descriptor.bearer) req.set('Authorization', "Bearer " + descriptor.bearer);

  if( checkNullFields(descriptor.params) ) {
    console.error('AllMandatoryFieldsNotSetError returning empty promise...');
    throw new Error("AllMandatoryFieldsNotSetError");
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


export function wireTransfer( bearer, amount, receiver, receiverAccount, description ) {
  const descriptor = API_METHODS.WIRE_TRANSFER;
  descriptor.bearer = bearer;
  descriptor.params.amount = amount;
  descriptor.params.receiver = receiver;
  descriptor.params.receiverAccount = receiverAccount;
  descriptor.params.description = description

  return genericCall( descriptor );
}