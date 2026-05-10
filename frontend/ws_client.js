// frontend/ws_client.js

function connectWS(onMessage) {
  const statusEl = document.getElementById("wsStatus");


  ws.onopen = () => {
    if (statusEl) statusEl.textContent = "WS: ✅ Connected";
  };

  ws.onerror = () => {
    if (statusEl) statusEl.textContent = "WS: ❌ Error";
  };

  ws.onclose = () => {
    if (statusEl) statusEl.textContent = "WS: ⚠️ Closed";
  };

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);

      // دعم نتائج الضغط
      if (data.type === "stressUpdate") {
        onMessage(data);
        return;
      }

      onMessage(data);

    } catch (err) {
      console.error("WS parse error:", err);
    }
  };

  return ws;
}

export { connectWS };
