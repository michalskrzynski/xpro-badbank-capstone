const transactionDal = require( "../dal/transaction-dal");

/**
 * Controller that lists all transactions belonging to the user.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function transactions(req, res, next) {

  const userId = req.user.user._id;
  
  transactionDal.forUser( userId )
    .then( results => res.send( {message: "ok", transactions: results} ) )
    .catch( err => {
      console.log( err );
      res.status(201).send( {message: "error", error: err} );
    } );
}


module.exports = transactions;