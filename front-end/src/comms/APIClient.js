import request from 'superagent';

const SERVER_URL = "http://localhost:3001";
const API_PATH = "/api/v1";

function apiMethodUrl( methodName ) {
  return SERVER_URL + API_PATH + methodName;
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

export function loginUser( email, password, doWithToken ) {
  const methodName = '/users/login';
  const data = {email, password};
  console.log( "Sending through api: ", data);

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
      }
    });
     
}