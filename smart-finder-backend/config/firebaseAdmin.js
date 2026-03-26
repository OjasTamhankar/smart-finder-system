const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const normalizeSecretValue = value =>
  typeof value === "string"
    ? value.trim().replace(/^['"]|['"]$/g, "")
    : "";

const normalizePrivateKey = value =>
  normalizeSecretValue(value).replace(/\\n/g, "\n");

const buildServiceAccount = serviceAccount => {
  if (!serviceAccount) {
    return null;
  }

  const projectId =
    normalizeSecretValue(
      serviceAccount.project_id || serviceAccount.projectId
    ) || "";
  const clientEmail =
    normalizeSecretValue(
      serviceAccount.client_email || serviceAccount.clientEmail
    ) || "";
  const privateKey = normalizePrivateKey(
    serviceAccount.private_key || serviceAccount.privateKey
  );

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey
  };
};

const getServiceAccountFromJson = () => {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return null;
  }

  try {
    return buildServiceAccount(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    );
  } catch (error) {
    console.error(
      "Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:",
      error.message
    );
    return null;
  }
};

const getServiceAccountFromPath = () => {
  const configuredPath = normalizeSecretValue(
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  );

  if (!configuredPath) {
    return null;
  }

  const absolutePath = path.resolve(process.cwd(), configuredPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(
      `Firebase service account file was not found at ${absolutePath}`
    );
    return null;
  }

  try {
    const fileContents = fs.readFileSync(absolutePath, "utf8");
    return buildServiceAccount(JSON.parse(fileContents));
  } catch (error) {
    console.error(
      "Failed to read FIREBASE_SERVICE_ACCOUNT_PATH:",
      error.message
    );
    return null;
  }
};

const getServiceAccountFromEnvParts = () =>
  buildServiceAccount({
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY
  });

const serviceAccount =
  getServiceAccountFromJson() ||
  getServiceAccountFromPath() ||
  getServiceAccountFromEnvParts();

if (!serviceAccount) {
  console.warn(
    "Firebase Admin credentials are not configured. Push notifications are disabled. Set FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_SERVICE_ACCOUNT_PATH, or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
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
