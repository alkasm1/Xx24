// packages/alm-core/ids/gentaskid.js

function genTaskId() {
  return (
    "task-" +
    Math.random().toString(36).slice(2)
  );
}

module.exports = {
  genTaskId
};
