import { Transaction } from "../models/Transaction";
const { ObjectId } = require('mongodb');




/**
 * Yields all Users' transaction from the database. 
 * @returns Promise
 */
async function forUser( userId ) {
  const allUsers = await User.find({userId: userId}).exec();
  return allUsers;
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