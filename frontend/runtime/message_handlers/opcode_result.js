// frontend/runtime/message_handlers/opcode_result.js

export function handleOpcodeResult(
  msg
) {

  const resultBox =
    document.getElementById(
      "opcodeResult"
    );

  if (!resultBox) {
    return;
  }

  resultBox.textContent =
    JSON.stringify(
      msg,
      null,
      2
    );
}
