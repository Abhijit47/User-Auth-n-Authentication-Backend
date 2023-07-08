const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Authrization and Authentication." });
});

app.use("/api/v1/", userRouter);

// Wildcard route
app.all('*', (req, res) => {
  const { method, originalUrl } = req;
  res.status(401).json({ message: `Can't ${method} on this ${originalUrl} URL.` });
});

module.exports = app;