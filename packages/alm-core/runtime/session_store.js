// packages/alm-core/runtime/session_store.js

const sessions = new Map();

// -----------------------------
// ADD
// -----------------------------
function add(session) {

  sessions.set(
    session.sessionId,
    session
  );

  return session;
}

// -----------------------------
// GET
// -----------------------------
function get(sessionId) {

  return (
    sessions.get(sessionId) ||
    null
  );
}

// -----------------------------
// UPDATE
// -----------------------------
function update(
  sessionId,
  patch
) {

  const s =
    sessions.get(sessionId);

  if (!s) {
    return null;
  }

  Object.assign(
    s,
    patch
  );

  return s;
}

// -----------------------------
// REMOVE
// -----------------------------
function remove(sessionId) {

  return sessions.delete(
    sessionId
  );
}

// -----------------------------
// ALL
// -----------------------------
function all() {

  return Array.from(
    sessions.values()
  );
}

// -----------------------------
// STATS
// -----------------------------
function stats() {

  const allSessions =
    all();

  const now =
    Date.now();

  return {
    total:
      allSessions.length,

    active:
      allSessions.filter(
        s => s.active
      ).length,

    stale:
      allSessions.filter(
        s =>
          now -
            s.lastSeen >
          30000
      ).length
  };
}

module.exports = {
  add,
  get,
  update,
  remove,
  all,
  stats
};
