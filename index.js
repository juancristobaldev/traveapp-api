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

    const urlProduction = "https://traveapp-api.vercel.app",
      urlDevelopment = "http://localhost:3000";

    const domain =
      process.env.CONTEXT === "development" ? urlDevelopment : urlProduction;

    res.redirect(
      `exp+traveapp://${urlProduction}/${userQueryParams.toString()}`
    );
  }
});

app.get("/error", async (req, res) => {
  const variablesEntorno = await process.env;
  res.send([
    process.env["GOOGLE_CLIENT_ID"],
    process.env["GOOGLE_SECRET_CLIENT_ID"],
    process.env["GOOGLE_CALLBACK_URL"],
  ]);
});

app.get("/login/federated/google", passport.authenticate("google"));
app.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/error",
  })
);

app.get("/login/federated/facebook", passport.authenticate("facebook"));
app.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/success",
    failureRedirect: "/error",
  })
);

// routes

app.use(require("./routes/index"));
// server
app.listen(port, () => {
  console.log(`🚀 Server running at: ${port}`);
});
