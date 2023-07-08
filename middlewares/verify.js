const jwt = require('jsonwebtoken');

const verifyUser = async (oldToken, secret_key) => {
  const oldToken = jwt.decode(oldToken, secret_key);
};

module.exports = verifyUser;