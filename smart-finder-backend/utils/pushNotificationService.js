const admin = require("firebase-admin");
const firebaseApp = require("../config/firebaseAdmin");

const MAX_TOKENS_PER_BATCH = 500;
const INVALID_TOKEN_CODES = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered"
]);

const chunkTokens = tokens => {
  const chunks = [];

  for (let index = 0; index < tokens.length; index += MAX_TOKENS_PER_BATCH) {
    chunks.push(tokens.slice(index, index + MAX_TOKENS_PER_BATCH));
  }

  return chunks;
};

const stringifyDataValues = data =>
  Object.entries(data || {}).reduce((accumulator, [key, value]) => {
    if (value !== undefined && value !== null) {
      accumulator[key] = String(value);
    }

    return accumulator;
  }, {});

const sendPushNotification = async ({
  tokens,
  title,
  body,
  data = {}
}) => {
  const uniqueTokens = [...new Set((tokens || []).filter(Boolean))];

  if (!firebaseApp || uniqueTokens.length === 0) {
    return {
      sentCount: 0,
      invalidTokens: []
    };
  }

  const messaging = admin.messaging(firebaseApp);
  const invalidTokens = [];
  let sentCount = 0;

  for (const tokenBatch of chunkTokens(uniqueTokens)) {
    const response = await messaging.sendEachForMulticast({
      tokens: tokenBatch,
      notification: {
        title,
        body
      },
      data: stringifyDataValues(data),
      webpush: {
        notification: {
          title,
          body,
          icon: "/logo192.png"
        },
        fcmOptions: data.link
          ? {
              link: data.link
            }
          : undefined
      }
    });

    sentCount += response.successCount;

    response.responses.forEach((result, index) => {
      if (
        !result.success &&
        INVALID_TOKEN_CODES.has(result.error?.code)
      ) {
        invalidTokens.push(tokenBatch[index]);
      }
    });
  }

  return {
    sentCount,
    invalidTokens
  };
};

module.exports = {
  sendPushNotification
};
