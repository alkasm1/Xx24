// backend/gateway/metrics.js

class Metrics {
  constructor(eventBus, registry) {
    this.eventBus = eventBus;
    this.registry = registry;

    this.counters = {
      opcodesTotal: 0,
      opcodesFailed: 0,
      transports: {}
    };

    this._wire();
  }

  _wire() {
    this.eventBus.on("opcode.received", () => {
      this.counters.opcodesTotal++;
    });

    this.eventBus.on("opcode.failed", () => {
      this.counters.opcodesFailed++;
    });

    this.eventBus.on("transport.exec", ({ transport, success }) => {
      if (!this.counters.transports[transport]) {
        this.counters.transports[transport] = { total: 0, failed: 0 };
      }
      this.counters.transports[transport].total++;
      if (!success) this.counters.transports[transport].failed++;
    });
  }

  snapshot() {
    const { online, offline } = this.registry.getStats();

    return {
      devices: { online, offline },
      opcodes: {
        total: this.counters.opcodesTotal,
        failed: this.counters.opcodesFailed
      },
      transports: this.counters.transports
    };
  }
}

module.exports = Metrics;
