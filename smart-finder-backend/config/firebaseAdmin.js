const admin = require("firebase-admin");

const getServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsedJson = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      );

      if (parsedJson.private_key) {
        parsedJson.private_key = parsedJson.private_key.replace(
          /\\n/g,
          "\n"
        );
      }

      return parsedJson;
    } catch (error) {
      console.error(
        "Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:",
        error.message
      );
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : null;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey
  };
};

const serviceAccount = getServiceAccount();

if (!serviceAccount) {
  console.warn(
    "Firebase Admin credentials are not configured. Push notifications are disabled."
  );
  module.exports = null;
} else {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  module.exports = admin.app();
}
