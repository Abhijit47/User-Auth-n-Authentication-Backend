const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Configure dotenv
dotenv.config({ path: "./config.env" });

// Static variable
const PORT = process.env.PORT;
const MONGO_URL = process.env.DB_URI;
const MONGO_PASSWORD = process.env.DB_PASSWORD;

// Connecting with mongodb
const DB = MONGO_URL.replace("<password>", MONGO_PASSWORD);
mongoose.connect(DB)
  .then(() => console.log(`Connection successfull ✔`))
  .catch((err) => console.log(`Something went wrong in connection ❌ \n ${err}`));


app.listen(PORT, () => {
  console.log(`Server listen on http://localhost:${PORT}`);
});
