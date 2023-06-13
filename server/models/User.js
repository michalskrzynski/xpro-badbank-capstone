const { Schema, model } = require('mongoose');

const UserSchema = new Schema( {
  name: {type: String, required: true, maxLength: 32},
  email: {type: String, required: true, maxLength: 256},
  userSub: {type: String, required: true, maxLength:64}, //sub (subject) is the Cognito authentication id
  account_number: {type: String, required: true, maxLength: 20},
  balance: {type: Number, required: true, default: 0},
  created_at: {type: Date, default: Date.now}
});

UserSchema.virtual('lastTransaction')
  .get( function() {
    return this._lastTransaction
  })
  .set( function(lastTrans) {
    this._lastTransaction = lastTrans;
});


const User = model('User', UserSchema);

module.exports = User;
