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
      `cl.empdigital.traveapp://${domain}/success/${userQueryParams.toString()}`
    );
  }
});

app.get("/success/:user", (req, res) => {
  if (req.user) {
    res.send(req.user);
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
  (req, res, next) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  },
  (err, req, res, next) => {
    console.error(err);
    res.redirect("/error");
  },
  (req, res) => {
    res.redirect("/success");
  }
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
  const url =
    process.env.CONTEXT !== "development"
      ? "https://traveapp-api.vercel.app"
      : "http://localhost:3000";

  console.log(`🚀 Server running at ${url}`);
});
