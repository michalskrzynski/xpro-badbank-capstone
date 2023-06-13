import User from "../models/User";
const { ObjectId } = require('mongodb');
const transactionDal = require("../dal/transaction-dal");
const { transTypes } = require("../models/Transaction");


/**
 * Finds one user matching the matchObj
 * @param {Object} matchObj 
 * @returns Promise
 */
async function find( matchObj ) {
  return User.findOne( matchObj );
}


/**
 * Yields all Users' data from the database. 
 * @returns Promise
 */
async function all() {
  const allUsers = await User.find().sort({name: 1}).exec();
  return allUsers;
};


/**
 * Saves new user in the database.
 * userSub is the sub id from authentiaction authority
 * @param {name, email, account_number, userSub} userData 
 * @returns Promise
 */
async function create( userData ) {
  const user = new User( userData );
  return user.save();
} 


/**
 * Atomically finds a user and credits amount on its account using increment.
 * @param {String} userId 
 * @param {Number} amount 
 * @returns Promise with a new user
 */
async function credit( userId, amount, tData ) {
  let updatedUser = null;

  if( amount < 0 ) throw new Error("DepositAmountNegative");
  return User.findByIdAndUpdate( userId, { $inc: {balance: amount}}, {new: true} )
    .then( user => { 
      
      updatedUser = user;
      tData = tData || {
        userId,
        amount,
        transType: transTypes.DEPOSIT
      }
      tData.balanceBefore = updatedUser.balance - amount;
      tData.balanceAfter = updatedUser.balance;
      
      return transactionDal.create( tData );
    })
    .then( transaction => {
      updatedUser.lastTransaction = transaction;
      return updatedUser;
    })
}


/**
 * Atomically finds a user and withdraws the amount, but only if there is
 * enough balance. Uses negative increment.
 * @param {String} userId 
 * @param {Number} amount 
 * @returns 
 */
async function debit( userId, amount, tData ) {
  let updatedUser = null;

  return User.findOneAndUpdate( 
    { _id: ObjectId(userId), balance: { $gte: amount } }, 
    { $inc: { balance: -amount } },
    { new: true }
    
    ).then( user => {
      debugger;
      updatedUser = user;
      tData = tData || {
        userId,
        amount,
        transType: transTypes.WITHDRAWAL
      }
      tData.balanceBefore = updatedUser.balance + amount;
      tData.balanceAfter = updatedUser.balance;
      
      return transactionDal.create( tData );
    })
    .then( transaction => {
      updatedUser.lastTransaction = transaction;
      return updatedUser;
    })
}

module.exports = {find, all, create, credit, debit}