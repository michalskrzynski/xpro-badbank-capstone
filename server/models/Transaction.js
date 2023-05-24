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
  fromToAccount: {
    type: String,
    required: false,
    maxLength: 20
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }

})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;