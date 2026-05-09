// packages/alm-core/src/runtime/queue.js

class Queue {
  constructor({
    concurrency = 1
  } = {}) {
    this.items = [];
    this.processing = 0;
    this.concurrency = concurrency;
  }

  push(task, meta = {}) {
    if (typeof task !== "function") {
      throw new Error("Queue task must be a function");
    }

    this.items.push({
      id:
        meta.id ||
        `${Date.now()}-${Math.random()}`,

      task,
      meta
    });

    for (let i = 0; i < this.concurrency; i++) {
      this.next();
    }
  }

  async next() {
    if (this.processing >= this.concurrency) {
      return;
    }

    const item = this.items.shift();

    if (!item) {
      return;
    }

    this.processing++;

    try {
      await item.task();
    } catch (err) {
      console.error(
        "Queue task failed:",
        item.id,
        err
      );
    }

    this.processing--;

    this.next();
  }

  size() {
    return this.items.length;
  }

  isIdle() {
    return (
      this.items.length === 0 &&
      this.processing === 0
    );
  }

  async onIdle() {
    while (!this.isIdle()) {
      await new Promise(resolve =>
        setTimeout(resolve, 25)
      );
    }
  }
}

module.exports = Queue;
