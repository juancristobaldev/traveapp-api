const { readFileSync } = require("fs");
const { join } = require("path");

const express = require("express"),
  app = express();

const cors = require("cors");

const bodyParser = require("body-parser");

const session = require("express-session");
const { getApp } = require("./firebase/initializeFirebase");

require("dotenv").config({ path: "./.env" });

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT;

// routes

app.use(require("./routes/index"));
// server
app.listen(port, () => {
  console.log(`🚀 Server running at: ${port}`);
});
