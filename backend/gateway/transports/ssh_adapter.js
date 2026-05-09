// backend/gateway/transports/ssh_adapter.js

const { Client } = require("ssh2");

async function execSSH(device, payload, meta = {}) {
  const command = payload.command;
  if (!command) {
    throw new Error("SSH payload missing command");
  }

  return new Promise((resolve) => {
    const conn = new Client();
    const start = Date.now();

    let stdout = "";
    let stderr = "";
    let exitCode = null;
    let settled = false;

    const timeoutMs = meta.timeoutMs || 6000;

    const timeoutRef = setTimeout(() => {
      done({
        success: false,
        error: "SSH timeout",
        stdout: "",
        stderr: "",
        execMs: Date.now() - start,
        exitCode: null
      });
    }, timeoutMs);

    function done(payload) {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutRef);
      try {
        conn.end();
      } catch (_) {}
      resolve(payload);
    }

    conn.on("ready", () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          return done({
            success: false,
            error: err.message,
            stdout: "",
            stderr: "",
            execMs: Date.now() - start,
            exitCode: null
          });
        }

        stream.on("data", d => { stdout += d.toString(); });
        stream.stderr.on("data", d => { stderr += d.toString(); });
        stream.on("exit", code => { exitCode = code; });

        stream.on("close", () => {
          const ok =
            exitCode === 0 ||
            (exitCode === null && stderr.length === 0);

          done({
            success: ok,
            error: ok ? null : `SSH exit code: ${exitCode}`,
            stdout,
            stderr,
            execMs: Date.now() - start,
            exitCode
          });
        });
      });
    });

    conn.on("error", err => {
      done({
        success: false,
        error: err.message,
        stdout: "",
        stderr: "",
        execMs: Date.now() - start,
        exitCode: null
      });
    });

    conn.connect({
      host: device.ip,
      port: device.port || 22,
      username: device.username,
      password: device.password
    });
  });
}

module.exports = { execSSH };
