const {auth, verifyRefreshToken} = require('../impl/auth-impl');

async function usersRefresh(req, res, next) {
  console.log('JWT Verifying Refresh', req.body.RefreshToken);
  verifyRefreshToken( req.body.RefreshToken )
    .then( response => {
      console.log("Received response from verifier");
      res.send(response) 
    })
    .catch( err => res.status(410).send( err ));
  
}
  

module.exports = usersRefresh;