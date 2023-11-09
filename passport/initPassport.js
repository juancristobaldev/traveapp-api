const passport = require("passport");
const session = require("express-session");
const { getDataPeopleApi } = require("./getDataPeopleApi");
const { google } = require("googleapis");

const initPassport = (app) => {
  const GoogleStrategy = require("passport-google-oauth");

  GoogleStrategy.OAuth2Strategy;
  const FacebookStrategy = require("passport-facebook");

  if (!process.env.CONTEXT) require("dotenv").config({ path: "./.env" });

  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SECRET_EXPRESS_SESSION,
    })
  );

  app.use(passport.initialize());

  app.use(passport.session());

  passport.use(
    new GoogleStrategy.OAuth2Strategy(
      {
        clientID: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_SECRET_CLIENT_ID"],
        callbackURL: process.env["GOOGLE_CALLBACK_URL"],
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, cb) => {
        console.log(profile);

        const oauth2Client = new google.auth.OAuth2(
          process.env["GOOGLE_CLIENT_ID"],
          process.env["GOOGLE_SECRET_CLIENT_ID"],
          process.env["GOOGLE_CALLBACK_URL"]
        );

        const profileUser = await profile;

        const data = {
          id: profileUser.id,
          Nombre: profileUser.name.givenName,
          Apellido: profileUser.name.familyName,
          Email: profileUser.emails[0].value,
          accessToken,
        };

        console.log(accessToken);

        const variables = await getDataPeopleApi(accessToken, oauth2Client);

        console.log(variables);

        if (variables.birthday) data.FechaNacimiento = variables.birthday;
        if (variables.gender) data.Genero = variables.birthday;
        if (profileUser.photos[0].value)
          data.Perfil = profileUser.photos[0].value;

        console.log(data);

        return cb(null, data);
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env["FACEBOOK_CLIENT_ID"],
        clientSecret: process.env["FACEBOOK_SECRET_CLIENT_ID"],
        callbackURL: process.env["FACEBOOK_CALLBACK_URL"],
        state: true,
        profileFields: [
          "id",
          "displayName",
          "name",
          "email",
          "gender",
          "birthday",
          "photos",
        ],
      },
      async (accessToken, refreshToken, profile, cb) => {
        const data = {
          id: profile.id,
          Nombre: profile.name.givenName,
          Apellido: profile.name.familyName,
          Email: profile.emails[0].value,
          Genero: profile.gender === "male" ? "Masculino" : "Femenino",
          Perfil: profile.photos[0].value,
          accessToken,
        };

        return cb(null, data);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from the sessions
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

module.exports = { initPassport };
