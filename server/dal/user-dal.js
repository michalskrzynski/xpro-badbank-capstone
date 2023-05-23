import User from "../models/User";

async function userListAll() {
  const allUsers = await User.find().sort({name: 1}).exec();
  return allUsers;
};

async function createUser( userData ) {
  const user = new User( userData );
  return user.save();
} 

module.exports = {userListAll, createUser}