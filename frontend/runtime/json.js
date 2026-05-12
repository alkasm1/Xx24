// frontend/runtime/json.js

export function safeJson(
  data
) {

  try {

    return JSON.parse(data);

  } catch {

    return null;
  }
}
