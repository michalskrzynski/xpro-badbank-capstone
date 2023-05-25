const {auth} = require('../impl/auth-impl');

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