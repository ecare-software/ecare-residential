const SHIFT_NAMES = ["1st", "2nd", "3rd"];

const isSignatureImage = (sig) =>
  typeof sig === "string" && sig.startsWith("data:image/") && sig.length > 100;

// A shift counts as missing once a LATER shift has signed without it (no clock/end-of-shift time is
// involved), e.g. only 2nd signed -> ["1st"], only 3rd signed -> ["1st", "2nd"]. Shifts that
// come after the last signed one aren't missing yet - they may simply not have happened.
export const getMissingSignatureShifts = (signatureSection, shiftCount) => {
  const signatures = (signatureSection && signatureSection.signatures) || [];
  const slots = shiftCount === 2 ? 2 : 3;
  let lastSigned = -1;
  for (let i = 0; i < slots; i++) {
    if (isSignatureImage(signatures[i])) lastSigned = i;
  }
  const missing = [];
  for (let i = 0; i < lastSigned; i++) {
    if (!isSignatureImage(signatures[i])) missing.push(SHIFT_NAMES[i]);
  }
  return missing;
};
