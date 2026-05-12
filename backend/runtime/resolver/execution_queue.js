const Queue = require(
  "../../../packages/alm-core/src/runtime/queue"
);

const deviceQueues =
  new Map();

function getDeviceQueue(
  deviceId
) {

  if (
    !deviceQueues.has(
      deviceId
    )
  ) {

    deviceQueues.set(
      deviceId,
      new Queue({
        concurrency: 1
      })
    );
  }

  return deviceQueues.get(
    deviceId
  );
}

function getQueueStats() {

  const stats = {};

  for (const [
    deviceId,
    queue
  ] of deviceQueues.entries()) {

    stats[deviceId] = {

      queued:
        queue.size(),

      processing:
        queue.processing,

      idle:
        queue.isIdle()
    };
  }

  return stats;
}

module.exports = {
  getDeviceQueue,
  getQueueStats
};
