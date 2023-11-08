const { readFileSync } = require("fs");
const { join } = require("path");

const express = require("express"),
  app = express();

const cors = require("cors");

const bodyParser = require("body-parser");
const passport = require("passport");
const { initPassport } = require("./passport/initPassport");

require("dotenv").config({ path: "./.env" });

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT;

initPassport(app);

app.get("/success", async (req, res) => {
  const user = await req.user;

  if (user) {
    const userQueryParams = new URLSearchParams({ user: JSON.stringify(user) });

    const urlDevelopment = "http://localhost:3000",
      urlProduction = "https://traveapp-api.vercel.app";

    const domain =
      process.env.CONTEXT === "development" ? urlDevelopment : urlProduction;
    res.redirect(`exp+traveapp://${domain}/${userQueryParams.toString()}`);
  }
});

app.get("/login/federated/google", passport.authenticate("google"));
app.get(
  "/oauth2/redirect/google",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect(`/success`);
  }
);

app.get("/login/federated/facebook", passport.authenticate("facebook"));
app.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/success",
    failureRedirect: "/login",
  })
);

// routes

app.use(require("./routes/index"));
// server
app.listen(port, () => {
  console.log(`🚀 Server running at: ${port}`);
});
