const userDal = require("../dal/user-dal");
const { transTypes } = require("../models/Transaction");

async function usersWireTransfer(req, res, next) {
  const userId = req.user.user._id;
  //yes, user.user, because passport by default assigns all payload to req.user
  
  
  const amount = req.amount;
  if (amount <= 0)
    return res.status(410).send("Wire negative amount or zero error.");

  
    const receiver = await userDal.find({ account_number: req.body.receiverAccount });
  if (!receiver)
    res.send({ message: "error", error: "NoUserWithThatAccountNumber" });

  
  let updatedSender = null;
  const debitTData = {
    userId,
    amount,
    transType: transTypes.DEBIT,
    toFromId: receiver.id,
    toFromText: req.body.receiver,
    description: req.body.description
  };
  const creditTData = {
    userId: receiver.id,
    amount,
    transType: transTypes.CREDIT,
    toFromId: userId,
    toFromText: req.body.receiver,
    description: req.body.description
  };

  userDal.debit(userId, amount, debitTData)
    .then((user) => {
      //empty result is returned if userDal does not find the user with sufficient balance
      if (!user)
        return res.send({
          message: "error",
          error: "WithdrawInsufficientFunds",
        });
      updatedSender = user;
      return user;
    })
    .then((user) => userDal.credit(receiver.id, amount, creditTData))
    .then((updatedReceiver) => {
      return res.send({
        message: "ok",
        transferred: req.amount,
        user: updatedSender,
        transaction: updatedSender.lastTransaction,
      });
    })
    .catch((err) => res.send({ message: "error", error: err }))
}

module.exports = usersWireTransfer;
