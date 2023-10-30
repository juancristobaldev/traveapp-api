const { initializeApp, applicationDefault } = require("firebase-admin/app");
const admin = require("firebase-admin");

const initializeFirebase = async () => {
  console.log("Inicializando Firebase");
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  const app = await admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase inicializado");

  return app;
};

const getApp = async () => {
  let app;
  try {
    app = await initializeFirebase();
  } catch (error) {
    console.log(error);
  }
  return app;
};

module.exports = { getApp, initializeFirebase };
