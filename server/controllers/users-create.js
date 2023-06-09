const cognitoCreateUser = require('../impl/cognito-impl').createUser;
const userDal = require( "../dal/user-dal");
const generateAccountNumber = require( '../misc/account-gen');


async function usersCreate(req, res, next) {
  
  const {name, email, password} = req.body;
  const account_number = generateAccountNumber();

  cognitoCreateUser( email, password )
    .then( (cogResult) => userDal.create( {name, email, account_number, userSub: cogResult.userSub} ))
    .then( (result) => res.status(201).json({ message: "ok", data: result }) )
    .catch( (err) => {
      console.log( "Error: ", err );
      res.status(200).send( { message: "error", code: err.code, error:err } );
    });

}


module.exports = usersCreate;