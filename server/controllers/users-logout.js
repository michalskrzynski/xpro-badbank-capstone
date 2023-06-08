const {auth} = require('../impl/auth-impl');


/**
 * This controller performs a Logout operation
 */
async function usersLogout(req, res, next) {
  
  console.log('Logout controller');
  auth.authenticate( 'logout' , async(err, data, info) => {
    return res.send( {message: "ok"} ); 
  })(req, res, next);
}
  

module.exports = usersLogout;