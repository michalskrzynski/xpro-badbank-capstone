const cognitoCreateUser = require('../impl/cognito-impl').createUser;
const userDal = require( "../dal/user-dal");
const generateAccountNumber = require( '../misc/account-gen');


async function usersCreate(req, res, next) {
  
  const {name, email, password} = req.body;
  const account_number = generateAccountNumber();

  cognitoCreateUser( email, password )
    .then( (cogResult) => userDal.create( {name, email, account_number, userSub: cogResult.userSub} ))
    .then( (result) => res.status(200).json({ message: "ok", user: result }) )
    .catch( (err) => {
      console.log( "Error: ", err );
      if( err.code === "UsernameExistsException" )
        res.status(200).send( { message: "error", code: err.code, error:err } );
      else 
        res.sendStatus(500);
    });

}


module.exports = usersCreate;