import User from "../models/User";
const { ObjectId } = require('mongodb');

async function find( matchObj ) {
  return User.find( matchObj );
}

async function all() {
  const allUsers = await User.find().sort({name: 1}).exec();
  return allUsers;
};

async function create( userData ) {
  const user = new User( userData );
  return user.save();
} 

async function deposit( userId, amount ) {
  if( amount < 0 ) throw new Error("DepositAmountNegative");
  return User.findByIdAndUpdate( userId, { $inc: {balance: amount}}, {new: true} );
}

async function withdraw( userId, amount ) {
  return User.findOneAndUpdate( 
    { _id: ObjectId(userId), balance: { $gte: amount } }, 
    { $inc: { balance: -amount } },
    { new: true }
  )
}

module.exports = {find, all, create, deposit, withdraw}