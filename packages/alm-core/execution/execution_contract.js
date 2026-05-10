// packages/alm-core/execution/execution_contract.js

function normalizeExecutionResult(result = {}) {
  return {
    success: !!result.success,

    stdout:
      result.stdout === undefined
        ? ""
        : String(result.stdout),

    stderr:
      result.stderr === undefined
        ? ""
        : String(result.stderr),

    execMs: Number(result.execMs || 0),

    exitCode:
      result.exitCode === undefined
        ? null
        : result.exitCode,

    error:
      result.error === undefined || result.error === null
        ? null
        : String(result.error)
  };
}

module.exports = {
  normalizeExecutionResult
};
