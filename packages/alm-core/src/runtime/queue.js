// packages/alm-core/src/runtime/queue.js

class Queue {
  constructor({
    concurrency = 1,
    maxSize = 1000
  } = {}) {
    this.items = [];

    this.processing = 0;

    this.concurrency =
      concurrency;

    this.maxSize = maxSize;

    this.paused = false;

    this.stats = {
      completed: 0,
      failed: 0,
      pushed: 0
    };
  }

  // -----------------------------
  // PUSH
  // -----------------------------
  push(
    task,
    meta = {}
  ) {
    if (
      typeof task !==
      "function"
    ) {
      throw new Error(
        "Queue task must be a function"
      );
    }

    if (
      this.items.length >=
      this.maxSize
    ) {
      throw new Error(
        "Queue overflow"
      );
    }

    this.items.push({
      id:
        meta.id ||
        `${Date.now()}-${Math.random()}`,

      createdAt:
        Date.now(),

      task,

      meta
    });

    this.stats.pushed++;

    this.drain();
  }

  // -----------------------------
  // DRAIN
  // -----------------------------
  drain() {
    if (this.paused) {
      return;
    }

    while (
      this.processing <
      this.concurrency
    ) {
      this.next();
    }
  }

  // -----------------------------
  // NEXT
  // -----------------------------
  async next() {
    if (this.paused) {
      return;
    }

    if (
      this.processing >=
      this.concurrency
    ) {
      return;
    }

    const item =
      this.items.shift();

    if (!item) {
      return;
    }

    this.processing++;

    try {
      await item.task();

      this.stats.completed++;
    } catch (err) {
      this.stats.failed++;

      console.error(
        "Queue task failed:",
        item.id,
        err
      );
    } finally {
      this.processing--;

      this.next();
    }
  }

  // -----------------------------
  // CONTROL
  // -----------------------------
  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.drain();
  }

  clear() {
    this.items = [];
  }

  // -----------------------------
  // STATE
  // -----------------------------
  size() {
    return this.items.length;
  }

  isIdle() {
    return (
      this.items.length === 0 &&
      this.processing === 0
    );
  }

  snapshot() {
    return {
      queued:
        this.items.length,

      processing:
        this.processing,

      concurrency:
        this.concurrency,

      paused:
        this.paused,

      stats:
        this.stats
    };
  }

  async onIdle() {
    while (
      !this.isIdle()
    ) {
      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            25
          )
      );
    }
  }
}

module.exports = Queue;
