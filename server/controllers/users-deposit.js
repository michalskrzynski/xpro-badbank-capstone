const userDal = require("../dal/user-dal");

async function usersDeposit(req, res, next) {
  const userId = req.user.user._id;
  //yes, user.user, because passport by default assigns all payload to req.user
  const amount = req.amount;

  if (amount < 0) return res.status(410).send("Deposit negative amount error.");

  userDal
    .credit(userId, amount)
    .then((updatedUser) =>
      res.send({
        message: "ok",
        deposited: amount,
        user: updatedUser,
        transaction: updatedUser.lastTransaction,
      })
    )
    .catch((err) => res.send({ message: "error", error: err }));
}

module.exports = usersDeposit;
