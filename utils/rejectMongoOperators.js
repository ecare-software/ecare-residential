// Any $-prefixed top-level key in a client-supplied update body is a
// MongoDB update operator ($set, $unset, $inc, $rename, etc.), never a
// field name. MongoDB only ever recognizes update operators at the TOP
// LEVEL of the document passed to updateOne()/findOneAndUpdate() - so a
// route that spreads req.body into its update payload and then deletes a
// few specific plain keys (homeId, createdBy, createdByName, createDate)
// only protects those exact top-level names. A caller can smuggle the same
// reassignment inside a nested operator instead - e.g.
// { status: "COMPLETED", $set: { homeId: "other-home" } } - which those
// delete calls never touch, since $set itself isn't one of the deleted
// keys and homeId here isn't a top-level key at all. MongoDB (via
// Mongoose, verified against this repo's actual Mongoose 5.13 against a
// real mongodb-memory-server instance) merges that nested $set into the
// update's effective $set and applies it verbatim, silently overriding the
// delete-based guards and letting an authenticated user move a record
// across tenants or rewrite its audit author.
//
// Rejecting any $-prefixed top-level key outright closes this off
// entirely: once none are present, nothing the client sends can be
// interpreted as an operator, so the existing per-field delete guards are
// sufficient again.
function containsMongoOperatorKey(obj) {
  return (
    !!obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.keys(obj).some((key) => key.startsWith("$"))
  );
}

const MONGO_OPERATOR_ERROR = "Invalid update payload.";

module.exports = { containsMongoOperatorKey, MONGO_OPERATOR_ERROR };
