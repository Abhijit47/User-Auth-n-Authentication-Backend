const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utilities/utils');

const verifyUser = async (res, oldToken, secret_key) => {
  const oldToken = await jwt.decode(oldToken, secret_key);
  // Generates a timestamp for the current time
  let currentTime = Math.round(new Date() / 1000);

  // 3. check the time is expire or not
  if (currentTime <= oldToken.exp) {
    successResponse(res, "Token verified successfully.", 200);
  } else {
    errorResponse(res, "Link has been expired.", 498);
  }
};

module.exports = verifyUser;