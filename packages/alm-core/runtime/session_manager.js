// packages/alm-core/runtime/session_manager.js

const sessionStore = require(
  "./session_store"
);

const {
  genSessionId
} = require(
  "../ids/gensessionid"
);

const SESSION_TIMEOUT_MS =
  30000;

function createSessionManager() {
  // -----------------------------
  // CREATE SESSION
  // -----------------------------
  function createSession(
    ws,
    meta = {}
  ) {
    const session = {
      sessionId:
        genSessionId(),

      createdAt:
        Date.now(),

      lastSeen:
        Date.now(),

      tasks: [],

      active: true,

      meta
    };

    sessionStore.add(session);

    ws.sessionId =
      session.sessionId;

    return session;
  }

  // -----------------------------
  // TOUCH SESSION
  // -----------------------------
  function touchSession(
    sessionId
  ) {
    const session =
      sessionStore.get(
        sessionId
      );

    if (!session) {
      return null;
    }

    session.lastSeen =
      Date.now();

    return session;
  }

  // -----------------------------
  // ATTACH TASK
  // -----------------------------
  function attachTask(
    sessionId,
    taskId
  ) {
    const session =
      sessionStore.get(
        sessionId
      );

    if (!session) {
      return null;
    }

    if (
      !session.tasks.includes(
        taskId
      )
    ) {
      session.tasks.push(
        taskId
      );
    }

    return session;
  }

  // -----------------------------
  // DETACH TASK
  // -----------------------------
  function detachTask(
    sessionId,
    taskId
  ) {
    const session =
      sessionStore.get(
        sessionId
      );

    if (!session) {
      return null;
    }

    session.tasks =
      session.tasks.filter(
        t => t !== taskId
      );

    return session;
  }

  // -----------------------------
  // DESTROY SESSION
  // -----------------------------
  function destroySession(
    sessionId
  ) {
    const session =
      sessionStore.get(
        sessionId
      );

    if (!session) {
      return false;
    }

    session.active = false;

    return sessionStore.remove(
      sessionId
    );
  }

  // -----------------------------
  // CLEANUP DEAD SESSIONS
  // -----------------------------
  function cleanupExpiredSessions() {
    const now = Date.now();

    const sessions =
      sessionStore.all();

    sessions.forEach(
      session => {
        const age =
          now -
          session.lastSeen;

        if (
          age >
          SESSION_TIMEOUT_MS
        ) {
          console.log(
            "🧹 Session expired:",
            session.sessionId
          );

          destroySession(
            session.sessionId
          );
        }
      }
    );
  }

  // -----------------------------
  // HEARTBEAT LOOP
  // -----------------------------
  setInterval(() => {
    cleanupExpiredSessions();
  }, 5000);

  return {
    createSession,

    touchSession,

    attachTask,

    detachTask,

    destroySession,

    cleanupExpiredSessions,

    getSession:
      sessionStore.get,

    listSessions:
      sessionStore.all
  };
}

module.exports = {
  createSessionManager
};
