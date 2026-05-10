// packages/alm-core/ids/gensessionid.js

function genSessionId() {
  return (
    "sess-" +
    Math.random()
      .toString(36)
      .slice(2)
  );
}

module.exports = {
  genSessionId
};
