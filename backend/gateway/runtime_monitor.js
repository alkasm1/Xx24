// backend/gateway/runtime_monitor.js

function createRuntimeMonitor({
  taskStore,
  sessionStore,
  registry,
  wss,
  startedAt = Date.now()
}) {

  function getMemory() {

    const mem = process.memoryUsage();

    return {
      rss: mem.rss,
      heapTotal: mem.heapTotal,
      heapUsed: mem.heapUsed,
      external: mem.external
    };
  }

  function getTaskMetrics() {

    const tasks = taskStore.all();

    const metrics = {
      total: tasks.length,

      pending: 0,
      running: 0,
      success: 0,
      failed: 0,
      timeout: 0,

      avgExecMs: 0,
      slowestMs: 0
    };

    let totalExec = 0;
    let completed = 0;

    tasks.forEach(task => {

      switch (task.status) {

        case "PENDING":
          metrics.pending++;
          break;

        case "RUNNING":
          metrics.running++;
          break;

        case "SUCCESS":
          metrics.success++;
          break;

        case "FAILED":
          metrics.failed++;
          break;

        case "TIMEOUT":
          metrics.timeout++;
          break;
      }

      if (
        task.startedAt &&
        task.finishedAt
      ) {

        const execMs =
          task.finishedAt -
          task.startedAt;

        totalExec += execMs;

        completed++;

        if (
          execMs >
          metrics.slowestMs
        ) {
          metrics.slowestMs =
            execMs;
        }
      }
    });

    metrics.avgExecMs =
      completed > 0
        ? Math.round(
            totalExec /
            completed
          )
        : 0;

    return metrics;
  }

  function getSessionMetrics() {

    const sessions =
      sessionStore.all();

    const now = Date.now();

    return {
      total: sessions.length,

      active:
        sessions.filter(
          s => s.active
        ).length,

      stale:
        sessions.filter(
          s =>
            now -
              s.lastSeen >
            30000
        ).length,

      sessions:
        sessions.map(s => ({
          sessionId:
            s.sessionId,

          ageMs:
            now -
            s.createdAt,

          idleMs:
            now -
            s.lastSeen,

          taskCount:
            s.tasks.length,

          active:
            s.active
        }))
    };
  }

  function getHealth(taskMetrics) {

    if (
      taskMetrics.running >
      100
    ) {
      return "overloaded";
    }

    if (
      taskMetrics.failed >
      taskMetrics.success
    ) {
      return "degraded";
    }

    return "healthy";
  }

  function snapshot() {

    const taskMetrics =
      getTaskMetrics();

    const sessionMetrics =
      getSessionMetrics();

    return {
      ts: Date.now(),

      uptimeMs:
        Date.now() -
        startedAt,

      health:
        getHealth(
          taskMetrics
        ),

      wsClients:
        wss.clients.size,

      devices:
        registry.getStats(),

      memory:
        getMemory(),

      tasks:
        taskMetrics,

      sessions:
        sessionMetrics
    };
  }

  return {
    snapshot
  };
}

module.exports = {
  createRuntimeMonitor
};
