// frontend/runtime/message_handlers/snapshot.js

export function handleSnapshot(
  msg
) {

  const devicesBox =
    document.getElementById(
      "devicesBox"
    );

  if (!devicesBox) {
    return;
  }

  devicesBox.textContent =
    JSON.stringify(
      {
        devices:
          msg.devices,

        metrics:
          msg.metrics
      },
      null,
      2
    );
}
