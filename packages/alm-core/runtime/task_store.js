// packages/alm-core/runtime/task_store.js

const tasks = new Map();

// -----------------------------
// ADD
// -----------------------------
function add(task) {
  tasks.set(task.id, task);

  return task;
}

// -----------------------------
// GET
// -----------------------------
function get(id) {
  return tasks.get(id) || null;
}

// -----------------------------
// UPDATE
// -----------------------------
function update(id, patch) {
  const task = tasks.get(id);

  if (!task) {
    return null;
  }

  Object.assign(task, patch);

  return task;
}

// -----------------------------
// ALL
// -----------------------------
function all() {
  return Array.from(
    tasks.values()
  );
}

// -----------------------------
// REMOVE
// -----------------------------
function remove(id) {
  return tasks.delete(id);
}

// -----------------------------
// CLEAR
// -----------------------------
function clear() {
  tasks.clear();
}

// -----------------------------
// STATS
// -----------------------------
function stats() {

  const allTasks =
    all();

  return {
    total:
      allTasks.length,

    pending:
      allTasks.filter(
        t =>
          t.status ===
          "PENDING"
      ).length,

    running:
      allTasks.filter(
        t =>
          t.status ===
          "RUNNING"
      ).length,

    success:
      allTasks.filter(
        t =>
          t.status ===
          "SUCCESS"
      ).length,

    failed:
      allTasks.filter(
        t =>
          t.status ===
          "FAILED"
      ).length,

    timeout:
      allTasks.filter(
        t =>
          t.status ===
          "TIMEOUT"
      ).length,

    cancelled:
      allTasks.filter(
        t =>
          t.status ===
          "CANCELLED"
      ).length
  };
}

module.exports = {
  add,
  get,
  update,
  all,
  remove,
  clear,
  stats
};
