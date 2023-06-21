import { Transaction } from "../models/Transaction";
const { ObjectId } = require('mongodb');




/**
 * Yields all Users' transaction from the database. 
 * @returns Promise
 */
async function forUser( userId ) {
  const allTransactions = await Transaction.find({userId: userId}).sort({ date: -1 }).exec();
  return allTransactions;
};


/**
 * Saves new Transaction in the database.
 * @returns Promise
 */
async function create( tData ) {
  const transaction = new Transaction( tData );
  return transaction.save();
} 

module.exports = {forUser, create}