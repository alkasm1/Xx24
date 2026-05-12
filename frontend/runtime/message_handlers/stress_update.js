import {
  runtimeState
} from "../state.js";

import {
  renderStressResults
} from "../../renderers/stress_renderer.js";

import {
  logLine
} from "../logger.js";

export function handleStressUpdate(
  msg
) {

  runtimeState.stressRunning =
    false;

  renderStressResults(
    msg.data
  );

  logLine(
    "✅ Stress test completed"
  );
}
