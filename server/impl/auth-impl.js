const dotenv = require('dotenv');
const User = require('../models/User');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require('jsonwebtoken');

const {poolData, cognitoAuth} = require('../impl/cognito-impl');





/**
 * 
 * Local Strategy definition, to use for Login
 * 
 */
const localStrategy = new LocalStrategy( {
  usernameField: 'email',
  },
  async (email, password, done) => {
    console.log(`User ${email} trying to log in.`);
    
    try {
      const user = await User.findOne({ email });
      if( !user ) return done(null, false, { message: 'Incorrect email or password' });

      //if user exists in our database, we test Cognito
      const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: poolData.ClientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        }
      }
    
      cognitoAuth.initiateAuth( params, (err, data) => {
        if( err ) {
          console.log( 'Authentication error: ', err);
          return done(null, false, { message: 'Incorrect email or password' });
        }

        //there are 3 tokens coming from AWS
        const { AccessToken, IdToken, RefreshToken } = data.AuthenticationResult;
        //but in the payload included in our token, we will only send 2
        const payload = { aws_auth: {AccessToken, IdToken}, user };
        const options = {expiresIn: '1h'};
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    
        return done( null, {token, RefreshToken} );
      });
    
    } catch (error) {
      return done(error);
    }
  });


/**
 * 
 * JWT Strategy definition, to use for each subsequent request
 * 
 */
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: true, //ignore here to capture later
  },
  (payload, done) => {
    if (Date.now() > payload.exp * 1000) {
      // token is expired
      console.log("Token expired");
      return done(null, false, '/loginRefresh'); //the last parameter adds to 401 header WWW-authenticate
    }

    if ( !payload.aws_auth || !payload.user) {
      console.log( "Login wrong payload: ", payload );
      return done(null, false);
    }

    return done(null, payload);
  }
);



async function verifyRefreshToken( rt/*, appendPayload*/ ) {
  const params = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: poolData.ClientId,
    AuthParameters: {
      REFRESH_TOKEN: rt
    }
  };

  return new Promise( (resolve, reject) => {
    cognitoAuth.initiateAuth(params, (err, data) => {
      if( err ) {
        console.log( 'Refresh Token Authentication error: ', err);
        reject( err )
      }
      console.log( 'Refresh Token Authentication proceeding: ', data);
      //there are 3 tokens coming from AWS
      const { AccessToken, IdToken, RefreshToken } = data.AuthenticationResult;
      //but in the payload included in our token, we will only send 2
      const payload = { aws_auth: {AccessToken, IdToken}  };
      // if( appendPayload ) {
      //   const [appendName, appendValue] = appendPayload( payload );
      //   payload['appendName'] = appendValue;
      // }
      const options = {expiresIn: '1h'};
      
      const token = jwt.sign(payload, process.env.JWT_SECRET, options);

      resolve( {token, RefreshToken: rt} );
    });
  })
}
// here new strategy

passport.use( localStrategy ); 
passport.use( jwtStrategy );
module.exports = {auth: passport, verifyRefreshToken};
