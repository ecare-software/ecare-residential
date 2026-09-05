const crypto = require("crypto");
const keys = require("../config/keys");

const DEFAULT_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const base64UrlEncode = (input) =>
  Buffer.from(input).toString("base64url");

const base64UrlDecode = (input) => Buffer.from(input, "base64url").toString();

const sign = (payloadB64) =>
  crypto
    .createHmac("sha256", keys.authTokenSecret)
    .update(payloadB64)
    .digest("base64url");

// signAuthToken({ email }) -> "base64(payload).base64(hmacSignature)"
const signAuthToken = ({ email }, ttlMs = DEFAULT_TTL_MS) => {
  const now = Date.now();
  const payload = { email, iat: now, exp: now + ttlMs };
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(payloadB64);
  return `${payloadB64}.${signature}`;
};

// verifyAuthToken(token) -> { email, iat, exp } | null
const verifyAuthToken = (token) => {
  if (typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) {
    return null;
  }

  const expectedSignature = sign(payloadB64);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch (e) {
    return null;
  }

  if (!payload.email || !payload.exp || Date.now() > payload.exp) {
    return null;
  }

  return payload;
};

module.exports = { signAuthToken, verifyAuthToken };
