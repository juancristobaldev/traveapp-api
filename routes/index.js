const { Router } = require("express");
const {
  getApp,
  initializeFirebase,
} = require("../firebase/initializeFirebase");
const routerIndex = Router();

const admin = require("firebase-admin");

initializeFirebase();

routerIndex.get("/", async (req, res) => {
  res.send("hello");
});

routerIndex.get("/custom-token/:uid", async (req, res) => {
  if (req.params.uid) {
    console.log(req.params.uid);

    const token = await admin.auth().createCustomToken(req.params.uid, {
      expiresIn: "7d",
    });

    res.send(token);
  }
});

module.exports = routerIndex;
