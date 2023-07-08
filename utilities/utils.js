const jwt = require('jsonwebtoken');

// for create a jwt token
exports.createToken = ({ _id, firstname, email }, secret_key, expTime) => {
  const token = jwt.sign({ _id, firstname, email }, secret_key, { expiresIn: expTime });
  return token;
};

// for decode a jwt token
exports.decodeToken = (token, secret_key) => {
  try {
    const decoded = jwt.decode(token, secret_key);
    return decoded;
  } catch (err) {
    console.log("utils js. 15", err);
    return err;
  }
};

// for sending successful response
exports.successResponse = (res, message, statusCode, data) => {
  return res.status(statusCode).json({ message: message, data: data });
};

// for sending error response
exports.errorResponse = (res, message, statusCode) => {
  return res.status(statusCode).json({ message: message });
};

// for catching error
exports.errorCatch = (err) => {
  return console.log(err.message);
};

exports.errorMessage = (res, err) => {
  res.status(500).json(`${err.name}\n${err.stack}\n${err.message}`);
};

exports.checkConsole = (err) => {
  return console.log(`${err.name}\n${err.message}\n${err.stack}`);
};

exports.errorConsole = (err) => {
  return console.log(`${err.name}\n${err.message}\n${err.stack}`);
};

