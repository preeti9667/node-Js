const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
};

const comparePassword = async (password, passwordEncrypted) => {
  const match = await bcrypt.compare(password, passwordEncrypted);
  if(match) return true;
  return false;
}

module.exports = { encryptPassword, comparePassword };
