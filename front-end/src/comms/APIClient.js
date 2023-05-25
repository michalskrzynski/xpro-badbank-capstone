import request from 'superagent';

const SERVER_URL = "http://localhost:3001";
const API_PATH = "/api/v1";


function apiMethodUrl( methodName ) {
  return SERVER_URL + API_PATH + methodName;
}

function saveRefreshToken( rt ) {
  localStorage.setItem('RefreshToken', rt);
}  

function getRefreshToken() {
  return localStorage.getItem('RefreshToken');
}

export function userHasBeenLoggedInBefore() {
  return getRefreshToken() !== null;
}


function decodeJwtPayload(token) {
  // Split the JWT into three parts: header, payload, and signature
  const parts = token.split('.');
  // Get the encoded payload from the second part
  const encodedPayload = parts[1];
  const decodedPayload = atob(encodedPayload);
  const parsedPayload = JSON.parse(decodedPayload);
  return parsedPayload;
}


export function createUser( user ) {
  const methodName = '/users/create';

  return request.post( apiMethodUrl( methodName ))
    .send( user )
    .end( (err, response) => {
      if( err ) {
        console.error( `API ${methodName} error: `, err);
      }
      else {
        console.log( `API ${methodName} responded: `, response);
      }
    })
    
}



export function loginUser( email, password, doWithTokenPayload ) {
  const methodName = '/users/login';
  const data = {email, password};
  console.log( "Sending through api: ", data);

  return request
    .post( apiMethodUrl( methodName ))
    .send( data )
    .end( (err, response ) => {
      if( err ) {
        console.error( `API ${methodName} error`, err);
        doWithTokenPayload( err, null );
      }
      else {
        console.log( `API ${methodName} responded: `, response);
        doWithTokenPayload( null, decodeJwtPayload(response.body.token) );
        saveRefreshToken(response.body.RefreshToken);
      }
    });    
}

export function refreshUser( doWithTokenPayload ) {
  const methodName = '/users/refresh';
  const data = {RefreshToken: getRefreshToken()};
  console.log('Refresh token call:', data);

  return request
    .post( apiMethodUrl( methodName ))
    .send( data )
    .end( (err, response ) => {
      if( err ) {
        console.error( `API ${methodName} error`, err);
        doWithTokenPayload( err, null );
      }
      else {
        console.log( `API ${methodName} responded: `, response);
        doWithTokenPayload( null, decodeJwtPayload(response.body.token) );
        saveRefreshToken(response.body.RefreshToken);
      }
    });    
}