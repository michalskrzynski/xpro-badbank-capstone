const userDal = require( "../dal/user-dal");

/**
 * Controller that lists all registered users.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function usersAll(req, res, next) {
  
  userDal.all()
    .then( results => res.send( {message: "ok", data: results} ) )
    .catch( err => res.status(410).send( {message: "error", error: err} ));

}


module.exports = usersAll;