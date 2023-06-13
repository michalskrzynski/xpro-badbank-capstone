const mongoose = require('mongoose')

const transTypes = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  CREDIT: 'credit',
  DEBIT: 'debit'
}

const transactionSchema = new mongoose.Schema( {

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transType: {
    type: String,
    enum: [
      transTypes.DEPOSIT,
      transTypes.WITHDRAWAL,
      transTypes.CREDIT,
      transTypes.DEBIT
    ],
    required: true,
  },
  toFromId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  toFromText: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }

})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {Transaction, transTypes};