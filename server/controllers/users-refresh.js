const jwt = require('jsonwebtoken');
const {verifyRefreshToken, parseJwt} = require('../impl/auth-impl');
const userDal = require('../dal/user-dal');


/**
 * Controller refreshes the users AccessToken, responding with a response
 * compliant to usersLogin controller. This may be considered as another
 * implementation of login, just with a RefreshToken.
 * 
 * Unfortunately because of a bug in AWS Cognito, which does not return
 * a new RefreshToken, we are using the same RefreshToken. This will
 * have to be changed when Cognito starts to respond with a new one.
 * 
 * Also, worth noting, that unline usersLogin, we cannot delegate this
 * functionality to Passport JWT strategy, because that one needs to verify
 * a RefreshToken, that we are not able to fulfill. We just dont have the
 * secret that AWS Cognito is holding.
 */
async function usersRefresh(req, res, next) {
  const RefreshToken = req.body.RefreshToken;

  let verifyPayload = null;
  verifyRefreshToken( RefreshToken )
    .then( payload => {
      verifyPayload = payload;
      const userSub = parseJwt( payload.aws_auth.IdToken )
      return userDal.find( {userSub: userSub.sub} );
    })
    .then( user => {
      verifyPayload.user = user 
      const options = {expiresIn: '1h'};
      const token = jwt.sign(verifyPayload, process.env.JWT_SECRET, options);
      res.send( {token, RefreshToken} );
    })
    .catch( err => res.status(410).send( err ));
  
}
  

module.exports = usersRefresh;