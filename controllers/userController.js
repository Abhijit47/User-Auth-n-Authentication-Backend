const dotenv = require('dotenv');
dotenv.configDotenv({ path: './config.env', encoding: 'utf8', debug: false, override: false });
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../model/userModel');
const { createToken, decodeToken, successResponse, errorResponse } = require('../utilities/utils');
const { sendMailToUser } = require('../services/mailService');

// create a user
exports.registerUser = async (req, res, next) => {
  // 1. collect data from req.body
  const { firstname, lastname, email, password } = req.body;

  // 2. Check if user is exist or not
  const existUser = await User.findOne({ email: email });
  if (existUser) {
    return errorResponse(res, "User already exist! Try to Login.", 400);
  }

  // check password
  if (validator.isAlphanumeric(password) === false) {
    return errorResponse(res, "Password doesn't contain alphanumeric character!", 400);
  }

  // 3. hash the user password
  const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

  try {
    // 4. create a user
    const newUser = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword
    });

    // 5. save this user to db
    const savedUser = await newUser.save();

    // 6. Send back a response to user
    successResponse(res, "User Registered Successfully.", 201);

  } catch (err) {
    errorResponse(res, "Something went wrong!!!", 400);
    next();
  }
};

// login a user
exports.loginUser = async (req, res, next) => {

  try {
    // 1. collect data from req.body
    const { email, password } = req.body;

    // 2. check if email is correct or not
    const existUser = await User.findOne({ email: email });
    if (!existUser) {
      return errorResponse(res, "Email or password wrong!", 400);
    }

    // 3. check if password is correct or not
    const isValidPassword = await bcrypt.compare(password, existUser.password);
    if (!isValidPassword) {
      return errorResponse(res, "Email or password wrong!", 400);
    }

    // 4. create a token for this user
    const { _id, name } = existUser;
    const token = createToken({ _id, name }, process.env.ACCESS_TOKEN, "1hr");

    // 5. send a response back to the user
    successResponse(res, "Login Successfully", 200, token);

  } catch (error) {
    errorResponse(res, "Something went wrong!", 400);
    next();
  }
  // next();
};

// get this user
exports.getUserDetails = async (req, res, next) => {
  try {
    // aggregation to exclude some field.
    const findUser = await User.aggregate()
      .project({ _id: 1, firstname: 1, lastname: 1, email: 1, created_At: 1 })
      .exec();
    successResponse(res, "Success", 200, findUser);
  } catch (err) {
    errorResponse(res, "Something went wrong!", 400);
  }
};

// forget password
exports.forgotPassword = async (req, res, next) => {
  try {
    // 1. find user associated with this email id
    const findUser = await User.findOne({ email: req.body.email });

    // 2. check email is valid or not
    if (!findUser) {
      return errorResponse(res, "User not found", 400);
    }

    // 3. create a forgot token and store it temporary in db
    const { _id, firstname, email } = findUser;
    const forgotToken = createToken({ _id, firstname, email }, process.env.ACCESS_TOKEN, "5m");
    const updateUser = await User.updateOne(
      { email: req.body.email },
      {
        $set:
          { forgotToken: forgotToken }
      }
    );

    // 4. send an email to the along with the token
    sendMailToUser(res, firstname, email, forgotToken);

    // 5. send a response back to user
    successResponse(res, "Please check your email.", 200, email);

  } catch (err) {
    errorResponse(res, "Something went wrong. Try again!", 400);
  }
};

// reset password
exports.resetPassword = async (req, res, next) => {

  try {
    // 1. check user is exist or not
    const userToken = await User.findOne({ forgotToken: req.params.token });

    // 2. if user exist then decode the token
    if (userToken !== null) {
      const tokenDecode = await decodeToken(userToken.forgotToken, process.env.ACCESS_TOKEN);

      // Generates a timestamp for the current time
      let currentTime = Math.round(new Date() / 1000);

      // 3. check the time is expire or not
      if (currentTime <= tokenDecode.exp) {
        // ** only for developement time
        // console.log("not expired");
        successResponse(res, "Token verified successfully.", 200);

      } else {
        errorResponse(res, "Link has been expired.", 498);
      }

    } else {
      errorResponse(res, "Link is already used to reset password!", 204);
    }
  } catch (err) {
    errorResponse(res, err.message, 400);
  }
};

// new password
exports.newPassword = async (req, res, next) => {
  try {
    // 1. find user by his password
    const { password } = req.body;

    // 2. get token from req.params
    const { token } = req.params;

    // 3. decode this token
    const tokenDecode = await decodeToken(token, process.env.ACCESS_TOKEN);

    // 4. hashed the new password again
    const newHashPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

    // 5. find this user with token decoded email
    const filter = { email: tokenDecode.email };

    // 6. update value to update user
    const update = { password: newHashPassword, forgotToken: "" };

    // 7. update the user
    const updateUser = await User.findOneAndUpdate(filter, update, { new: true });

    // 8. send back response to the user
    successResponse(res, "password update successfully", 200);

  } catch (err) {
    errorResponse(res, err.message, 400);
  }
};