// packages/alm-core/runtime/session_store.js

const sessions = new Map();

function add(session) {
  sessions.set(
    session.sessionId,
    session
  );

  return session;
}

function get(sessionId) {
  return (
    sessions.get(sessionId) ||
    null
  );
}

function update(
  sessionId,
  patch
) {
  const s =
    sessions.get(sessionId);

  if (!s) {
    return null;
  }

  Object.assign(s, patch);

  return s;
}

function remove(sessionId) {
  return sessions.delete(
    sessionId
  );
}

function all() {
  return Array.from(
    sessions.values()
  );
}

module.exports = {
  add,
  get,
  update,
  remove,
  all
};
