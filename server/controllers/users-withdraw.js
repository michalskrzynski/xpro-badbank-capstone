const userDal = require('../dal/user-dal');


async function usersWithdraw(req, res, next) {

    const userId = req.user.userId; 
    const amount = req.amount;

    if( amount <= 0 ) return res.status(410).send("Deposit negative amount or zero error.");

    userDal.withdraw( userId, amount )
      .then( result => {
        //empty result is returned if userDal does not find the user with sufficient balance
        if( !result ) return res.send( {message: "error", error: "WithdrawInsufficientFunds"});
        return res.send( {message: "ok", user: result}) 
      })
      .catch( err => res.send( {message: "error", error: err }));
}

module.exports = usersWithdraw;

