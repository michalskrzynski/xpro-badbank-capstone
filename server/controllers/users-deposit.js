const userDal = require('../dal/user-dal');


async function usersDeposit(req, res, next) {

    const userId = req.user.userId; 
    const amount = req.amount;

    if( amount < 0 ) return res.status(410).send("Deposit negative amount error.");

    userDal.deposit( userId, amount )
      .then( result => res.send( {message: "ok", user: result}))
      .catch( err => res.send( {message: "error", error: err }));

}

module.exports = usersDeposit;

