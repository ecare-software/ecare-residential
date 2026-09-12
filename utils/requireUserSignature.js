const User = require("../models/User");
const { verifyAuthToken } = require("./authToken");

// Several form types (Incident Report, Serious Incident Report, Admission
// Assessment, Health Body Check, Illness/Injury, Restraint Report, 72-Hour
// Treatment Plan) don't persist a signature on the form document itself -
// their signature canvas is only ever a live stamp of the submitting
// user's own profile signature (User.signature), never saved with the
// record. The client blocks Submit when that profile signature is missing
// (see e.g. IncidentReport.js's validateForm), but that's a UI-only
// check - a direct API request could otherwise mark a form COMPLETED with
// no signature behind it anywhere. This is the server-side backstop for
// that: it re-checks the same condition (does this user have a signature
// on file) before allowing a form to be saved as COMPLETED.
//
// Identity comes from the httpOnly authToken cookie (set at login - see
// routes/api/users.js), verified server-side here via HMAC - never from a
// client-supplied email/createdBy/submittedByEmail field. A body field
// only tells you what the caller *claims*; on an edit, the persisted
// createdBy is specifically the ORIGINAL author, not necessarily whoever
// is submitting this request, so validating a body field either checks
// the wrong person or (worse) lets a caller name any signed user they
// like. This mirrors routes/api/client.js's requireFaceSheetEditAccess,
// which resolves identity the same way for the same reason.

function hasValidSignature(user) {
  return !!(user && Array.isArray(user.signature) && user.signature.length > 0);
}

// Resolves the actual authenticated user from the request's verified auth
// cookie. Returns null (never throws) if there's no cookie, it's invalid/
// expired, or it doesn't match a real user - callers should treat that as
// "not authenticated", not silently fall back to a client-supplied claim.
async function resolveAuthenticatedUser(req) {
  const decoded = verifyAuthToken(req.cookies?.authToken);
  if (!decoded?.email) return null;
  try {
    return await User.findOne({ email: decoded.email });
  } catch (e) {
    return null;
  }
}

// Whether the actual authenticated caller (not any client-supplied field)
// has a signature on file.
async function submitterHasSignature(req) {
  const user = await resolveAuthenticatedUser(req);
  return hasValidSignature(user);
}

const NOT_AUTHENTICATED_ERROR = "Not authenticated.";

const MISSING_SIGNATURE_ERROR =
  "A signature on file for the submitting user is required before this form can be marked COMPLETED. Create a signature under 'Manage Profile'.";

module.exports = {
  resolveAuthenticatedUser,
  submitterHasSignature,
  hasValidSignature,
  NOT_AUTHENTICATED_ERROR,
  MISSING_SIGNATURE_ERROR,
};
