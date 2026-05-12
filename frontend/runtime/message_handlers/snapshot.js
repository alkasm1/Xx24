import {
  runtimeState
} from "../state.js";

import {
  renderDevices
} from "../../renderers/devices_renderer.js";

export function handleSnapshot(
  msg
) {

  runtimeState.snapshot =
    msg;

  renderDevices({
    devices:
      msg.devices,

    metrics:
      msg.metrics,

    sessions:
      msg.sessions,

    activeTasks:
      msg.activeTasks,

    broadcasts:
      msg.broadcasts
  });
}
