const { Schema, model } = require('mongoose');

const UserSchema = new Schema( {
  name: {type: String, required: true, maxLength: 32},
  email: {type: String, required: true, maxLength: 256},
  userSub: {type: String, required: true, maxLength:64}
})

const User = model('User', UserSchema);

module.exports = User;
