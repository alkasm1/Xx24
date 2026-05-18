const {
  dispatch
} = require(
  "../dispatcher"
);

// =====================================
// EXECUTE TASK GRAPH
// =====================================

async function executeTaskGraph({

  device,

  graph = [],

  context = {}

}) {

  if (
    !Array.isArray(graph)
  ) {

    throw new Error(
      "Graph must be array"
    );
  }

  const results = [];

  for (const step of graph) {

    // ===================================
    // VALIDATION
    // ===================================

    if (!step.opcode) {

      throw new Error(
        "Graph step missing opcode"
      );
    }

    // ===================================
    // EXECUTE
    // ===================================

    const result =
      await dispatch(

        device,

        step.opcode,

        {

          ...(step.meta || {}),

          context
        }
      );

    // ===================================
    // STORE
    // ===================================

    results.push({

      step:
        step.id ||

        step.opcode,

      opcode:
        step.opcode,

      result
    });

    // ===================================
    // FAILURE STOP
    // ===================================

    if (
      !result.success
    ) {

      return {

        success: false,

        failedStep:

          step.opcode,

        results
      };
    }

    // ===================================
    // CONTEXT EXPORT
    // ===================================

    if (step.exportAs) {

      context[
        step.exportAs
      ] = result;
    }
  }

  return {

    success: true,

    results,

    context
  };
}

module.exports = {

  executeTaskGraph
};
