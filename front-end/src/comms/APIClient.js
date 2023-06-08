import request from 'superagent';

console.log("Value of env SERVER_URL:", process.env.REACT_APP_API_URL);


const API_PATH = "/api/v1";


function apiMethodUrl( methodName ) {
  return process.env.REACT_APP_API_URL + API_PATH + methodName;
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


export function allUsers() {
  const methodName = '/users';

  return new Promise( (resolve, reject ) => {
    request.get( apiMethodUrl( methodName ) )
      .end( ( err, response ) => {
        if( err ) {
          console.error( `API ${methodName} error: `, err);
          reject(err)
        }
        else {
          console.log( `API ${methodName} responded: `, response);
          resolve( response )
        }
      })
  });
}



export function createUser( user, cb ) {
  const methodName = '/users/create';

  return request.post( apiMethodUrl( methodName ))
    .send( user )
    .end( (err, response) => {
      if( err ) return cb(err, null);
      if( response.body.message === "error" ) cb( response.body.error.code, null );
      else cb( null, response )
    })
    
}


export function loginUser( email, password, doWithToken ) {
  const methodName = '/users/login';
  const data = {email, password};
  console.log( "Sending through api: " +apiMethodUrl( methodName ), data);

  return request
    .post( apiMethodUrl( methodName ))
    .send( data )
    .end( (err, response ) => {
      if( err ) {
        console.error( `API ${methodName} error`, err);
        doWithToken( err, null );
      }
      else {
        console.log( `API ${methodName} responded: `, response);
        doWithToken( null, response.body.token );
        saveRefreshToken(response.body.RefreshToken);
      }
    });    
}



export function refreshUser( doWithToken ) {
  const methodName = '/users/refresh';
  const data = {RefreshToken: getRefreshToken()};
  console.log('Refresh token call:', data);

  return request
    .post( apiMethodUrl( methodName ))
    .send( data )
    .end( (err, response ) => {
      if( err ) {
        console.error( `API ${methodName} error`, err);
        doWithToken( err, null );
      }
      else {
        console.log( `API ${methodName} responded: `, response);
        doWithToken( null, response.body.token );
        saveRefreshToken(response.body.RefreshToken);
      }
    });    
}


export function logout( token, cb ) {
  const methodName = '/users/logout';
  return request
    .post( apiMethodUrl( methodName ) )
    .set('Authorization', 'Bearer ' + token)
    .end();
}


export function deposit( token, amount, cb ) {
  const methodName = '/users/deposit';
  const data = {amount: amount};

  console.log('Deposit call:', data);

  return request
    .post( apiMethodUrl( methodName) )
    .set('Authorization', 'Bearer ' + token)
    .send( data )
    .end( cb );

}


export function withdraw( token, amount, cb ) {
  const methodName = '/users/withdraw';
  const data = {amount: amount};

  console.log('Withdraw call:', data);

  return request
    .post( apiMethodUrl( methodName) )
    .set('Authorization', 'Bearer ' + token)
    .send( data )
    .end( cb );

}