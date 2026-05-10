// packages/alm-core/runtime/session_manager.js

const sessionStore = require(
  "./session_store"
);

const {
  genSessionId
} = require(
  "../ids/gensessionid"
);

function createSessionManager() {
  function createSession(
    ws,
    meta = {}
  ) {
    const session = {
      sessionId:
        genSessionId(),

      createdAt: Date.now(),

      lastSeen: Date.now(),

      tasks: [],

      meta
    };

    sessionStore.add(session);

    ws.sessionId =
      session.sessionId;

    return session;
  }

  function touchSession(
    sessionId
  ) {
    return sessionStore.update(
      sessionId,
      {
        lastSeen: Date.now()
      }
    );
  }

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

    session.tasks.push(taskId);

    return session;
  }

  function destroySession(
    sessionId
  ) {
    return sessionStore.remove(
      sessionId
    );
  }

  return {
    createSession,
    touchSession,
    attachTask,
    destroySession,

    getSession:
      sessionStore.get,

    listSessions:
      sessionStore.all
  };
}

module.exports = {
  createSessionManager
};
