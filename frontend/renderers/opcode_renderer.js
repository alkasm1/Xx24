// frontend/renderers/opcode_renderer.js

const resultBox =
  document.getElementById(
    "opcodeResult"
  );

export function renderOpcodeResult(
  result
) {

  if (!resultBox) {
    return;
  }

  resultBox.textContent =
    JSON.stringify(
      result,
      null,
      2
    );
}
