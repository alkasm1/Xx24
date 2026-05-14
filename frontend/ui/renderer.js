export function renderTerminal(
  id,
  text
) {

  const el =
    document.getElementById(
      id
    );

  if (!el) {
    return;
  }

  el.textContent =
    text;
}

export function appendTerminal(
  id,
  text
) {

  const el =
    document.getElementById(
      id
    );

  if (!el) {
    return;
  }

  el.textContent +=
    `\n${text}`;

  el.scrollTop =
    el.scrollHeight;
}
