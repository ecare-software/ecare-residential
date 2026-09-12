const User = require("../models/User");

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

function hasValidSignature(user) {
  return !!(user && Array.isArray(user.signature) && user.signature.length > 0);
}

// Looks up a user by email + homeId and reports whether they have a
// signature saved to their profile. Resolves to false (never rejects) on
// a missing email/homeId or a lookup failure, so callers can treat
// "couldn't verify" the same as "no signature" rather than needing their
// own try/catch.
async function submitterHasSignature(email, homeId) {
  if (!email || !homeId) return false;
  try {
    const user = await User.findOne({ email, homeId });
    return hasValidSignature(user);
  } catch (e) {
    return false;
  }
}

const MISSING_SIGNATURE_ERROR =
  "A signature on file for the submitting user is required before this form can be marked COMPLETED. Create a signature under 'Manage Profile'.";

module.exports = { submitterHasSignature, MISSING_SIGNATURE_ERROR };
