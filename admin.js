//Configuring firebase admin and initialization
const admin = require("firebase-admin");

const serviceAccount = require("./config/starthack-796b2-firebase-adminsdk-v50vi-b635041a27.json");

const config = require("./config/fb_config");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.storageBucket,
});

const messaging = admin.messaging();

module.exports = { admin, messaging };
