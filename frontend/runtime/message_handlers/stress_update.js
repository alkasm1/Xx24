// frontend/runtime/message_handlers/stress_update.js

export function handleStressUpdate(
  msg
) {

  const stressResults =
    document.getElementById(
      "stressResults"
    );

  if (!stressResults) {
    return;
  }

  stressResults.textContent =
    JSON.stringify(
      msg.data,
      null,
      2
    );
}
