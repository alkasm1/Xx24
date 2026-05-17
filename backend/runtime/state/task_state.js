class TaskState {

  constructor() {

    this.tasks =
      new Map();
  }

  // =====================================
  // UPSERT
  // =====================================

  upsert(task) {

    if (!task?.id) {
      return;
    }

    this.tasks.set(
      task.id,
      {

        ...task,

        updatedAt:
          Date.now()
      }
    );
  }

  // =====================================
  // GET
  // =====================================

  get(taskId) {

    return this.tasks.get(
      taskId
    );
  }

  // =====================================
  // GET ALL
  // =====================================

  getAll() {

    return Array.from(
      this.tasks.values()
    );
  }

  // =====================================
  // REMOVE
  // =====================================

  remove(taskId) {

    this.tasks.delete(
      taskId
    );
  }

  // =====================================
  // CLEAR
  // =====================================

  clear() {

    this.tasks.clear();
  }
}

module.exports =
  new TaskState();
