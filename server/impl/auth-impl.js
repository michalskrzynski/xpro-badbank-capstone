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
    
        const auth = {
          AccessToken: data.AuthenticationResult.AccessToken,
          IdToken: data.AuthenticationResult.IdToken
        }

        const payload = { aws_auth: auth, userId: user.id }
        const options = {expiresIn: '1h'};
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    
        return done( null, {token} );
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
      return done(null, false, '/auth/refresh'); //the last parameter adds to 401 header WWW-authenticate
    }

    if ( !payload.aws_auth || !payload.userId) {
      console.log( "Login wrong payload: ", payload );
      return done(null, false);
    }

    return done(null, payload);
  }
);


passport.use( localStrategy ); 
passport.use( jwtStrategy );
module.exports = passport;
