const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('dotenv').config;


AWS.config.update( {
  accessKeyId: process.env.AMAZON_CREDENTIALS_KEY_ID,
  secretAccessKey: process.env.AMAZON_CREDENTIALS_ACCESS_KEY,
  region: process.env.AMAZON_REGION
})

const poolData = {
  UserPoolId: process.env.AMAZON_COGNITO_USER_POOL_ID,
  ClientId: process.env.AMAZON_COGNITO_CLIENT_ID,

}
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const cognitoAuth = new AWS.CognitoIdentityServiceProvider( {
  region: process.env.AMAZON_REGION,
  apiVersion: process.env.AMAZON_COGNITO_API_VERSION
})

/**
 * 
 * @param {*} email 
 * @param {*} password 
 * @returns Promise
 */
function createUser(email, password) {
  return new Promise((resolve, reject) => {
    userPool.signUp( email, password, null, null, (err, result) => {
      if( err ) reject(err);
      else resolve( result );
    }
  )}); 
}

module.exports = { AWS, userPool, createUser,  poolData, cognitoAuth, AmazonCognitoIdentity }