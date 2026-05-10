// packages/alm-core/runtime/task_store.js

const tasks = new Map();

function add(task) {
  tasks.set(task.id, task);
  return task;
}

function get(id) {
  return tasks.get(id) || null;
}

function update(id, patch) {
  const task = tasks.get(id);

  if (!task) {
    return null;
  }

  Object.assign(task, patch);

  return task;
}

function all() {
  return Array.from(tasks.values());
}

function remove(id) {
  return tasks.delete(id);
}

function clear() {
  tasks.clear();
}

module.exports = {
  add,
  get,
  update,
  all,
  remove,
  clear
};
