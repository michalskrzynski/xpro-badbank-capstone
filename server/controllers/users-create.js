const { createUser, User } = require('../impl/cognito-impl');
const userDal = require( "../dal/user-dal");

async function usersCreate(req, res, next) {
  
  const {name, email, password} = req.body;
  createUser( email, password )
    .then( (cogResult) => userDal.createUser( {name, email, userSub: cogResult.userSub} ))
    .then( (result) => res.json({ message: "ok", data: result }) )
    .catch( (err) => {
      res.status(410).send( { message: "error", code: err.code } );
    });

}


module.exports = usersCreate;