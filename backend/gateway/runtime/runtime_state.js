class RuntimeState {

  constructor() {

    this.state = {

      devices:
        new Map(),

      sessions:
        new Map(),

      tasks:
        new Map(),

      metrics: {

        executed: 0,

        failed: 0,

        succeeded: 0
      },

      runtime: {

        startedAt:
          Date.now()
      }
    };
  }

  // =====================================
  // DEVICES
  // =====================================

  setDevice(
    device
  ) {

    this.state.devices.set(

      device.deviceId,

      device
    );
  }

  getDevice(
    id
  ) {

    return this.state.devices.get(
      id
    );
  }

  getDevices() {

    return Array.from(

      this.state.devices.values()
    );
  }

  // =====================================
  // TASKS
  // =====================================

  setTask(
    task
  ) {

    this.state.tasks.set(

      task.id,

      task
    );
  }

  getTask(
    id
  ) {

    return this.state.tasks.get(
      id
    );
  }

  getTasks() {

    return Array.from(

      this.state.tasks.values()
    );
  }

  // =====================================
  // SESSIONS
  // =====================================

  setSession(
    session
  ) {

    this.state.sessions.set(

      session.id,

      session
    );
  }

  getSessions() {

    return Array.from(

      this.state.sessions.values()
    );
  }

  removeSession(
    id
  ) {

    this.state.sessions.delete(
      id
    );
  }

  // =====================================
  // METRICS
  // =====================================

  incrementSuccess() {

    this.state.metrics.executed++;

    this.state.metrics.succeeded++;
  }

  incrementFailure() {

    this.state.metrics.executed++;

    this.state.metrics.failed++;
  }

  getMetrics() {

    return this.state.metrics;
  }

  // =====================================
  // SNAPSHOT
  // =====================================

  snapshot() {

    return {

      devices:
        this.getDevices(),

      tasks:
        this.getTasks(),

      sessions:
        this.getSessions(),

      metrics:
        this.getMetrics(),

      runtime:
        this.state.runtime
    };
  }
}

module.exports =
  new RuntimeState();
