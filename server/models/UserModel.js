const { getUsers ,getUserByUsername} = require('../database/queries');
const getAllUsers = () => {
    return getUsers();
};
const getUser = (username) =>{
   return getUserByUsername(username);
}
class User {
    constructor(ID, Username, Email, PasswordHash,Salt) {
      this.ID = ID;
      this.Username = Username;
      this.Email = Email;
      this.PasswordHash = PasswordHash;
      this.Salt = Salt;
    }

}

module.exports = {
    getAllUsers,
    User,
    getUser
};