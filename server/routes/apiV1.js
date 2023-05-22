const express = require('express');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const JWT_SECRET = 'MY_JWT_SECRET';

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


function authenticate( req, res, next ) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if( !token ) {
    return res.status(401).json( {error: 'Access Token Not Found'});
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if( err ) {
      console.log('Token verification error:', err);
      return res.status(403).json( {error: 'Invalid token'});
    }

    req.user = decoded;
    next();
  });
}

const router = express.Router();


router.post('/users/login', (req, res) => {
  
  const {username, password} = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: poolData.ClientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    }
  }

  cognitoAuth.initiateAuth( params, (err, data) => {
    if( err ) {
      console.log( 'Authentication error: ', err);
      return res.status(500).json({error: 'Authentication Failed'});
    }

    const accessToken = data.AuthenticationResult.AccessToken;
    const idToken = data.AuthenticationResult.IdToken;

    const payload = {
      accessToken,
      idToken,
    };

    const secret = JWT_SECRET;
    const options = {expiresIn: '1h'};
    const signedToken = jwt.sign(payload, secret, options);

    res.json( {token: signedToken} )
  })

  

})

router.post('/users/create', (req, res) => {
  console.log( req.body)

  userPool.signUp( req.body.email, req.body.password, null, null, (err, result) => {
    if( err ) {
      console.log('Error Signing Up', err);
      res.status(405).send('Something went wrong.');
    }
    const cognitoUser = result.user;
    res.json({ message: "ok", data: cognitoUser });
  })

});

router.post('/users/:id/deposit', authenticate, (req,res) => {

  const resData = { ...req.body, balance: "999.99"}

  res.send({ message: "ok", data: resData });
})

router.post('/users/:id/withdraw', authenticate, (req, res) => {
  res.send({ message: "ok", data: req.body });
})


export default router;
