const jwt = require('jsonwebtoken');
const {verifyRefreshToken, parseJwt} = require('../impl/auth-impl');
const userDal = require('../dal/user-dal');


/**
 * Controller refreshes the users AccessToken
 */
async function usersRefresh(req, res, next) {
  const RefreshToken = req.body.RefreshToken;

  let verifyPayload = null;
  verifyRefreshToken( RefreshToken )
    .then( payload => {
      verifyPayload = payload;
      const userSub = parseJwt( payload.aws_auth.IdToken)
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