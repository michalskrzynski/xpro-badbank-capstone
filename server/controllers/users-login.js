const {auth} = require('../impl/auth-impl');


/**
 * This controller performs a Login with Local strategy, ie. email and pasword
 * The whole functionality is delegated to an already registered Passport Local
 * Strategy, therefore calling it.
 * @param {*} req 
 * @param {*} res Containing {token, RefreshToken}
 * @param {*} next 
 */
async function usersLogin(req, res, next) {
  
  auth.authenticate( 'local' , async(err, data, info) => {
    if(err) return next(err);
    if( !data ) return res.status(403).json( data );
    try {
      await req.logIn( data, {session: false});
      return res.json( data ); 
    } catch( error ) {
      res.sendStatus(403).json( {message: "Invalid username or password."} ); 
      next();
    }
  })(req, res, next);
}
  

module.exports = usersLogin;