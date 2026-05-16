// backend/gateway/transports/ssh_adapter.js

const { Client } = require("ssh2");

// =====================================
// CONNECTION POOL
// =====================================

const connectionPool =
  new Map();

// =====================================
// HELPERS
// =====================================

function getDeviceKey(device) {

  return [
    device.ip,
    device.port || 22,
    device.username
  ].join(":");
}

// =====================================
// CREATE CONNECTION
// =====================================

function createConnection(device) {

  return new Promise(
    (resolve, reject) => {

      const conn =
        new Client();

      conn.on(
        "ready",
        () => {

          resolve(conn);
        }
      );

      conn.on(
        "error",
        reject
      );

      conn.connect({

        host:
          device.ip,

        port:
          device.port || 22,

        username:
          device.username,

        password:
          device.password,

        readyTimeout:
          10000
      });
    }
  );
}

// =====================================
// GET POOLED CONNECTION
// =====================================

async function getConnection(
  device
) {

  const key =
    getDeviceKey(device);

  const existing =
    connectionPool.get(key);

  if (existing) {

    return existing;
  }

  const conn =
    await createConnection(
      device
    );

  connectionPool.set(
    key,
    conn
  );

  conn.on(
    "close",
    () => {

      connectionPool.delete(
        key
      );
    }
  );

  conn.on(
    "error",
    () => {

      connectionPool.delete(
        key
      );
    }
  );

  return conn;
}

// =====================================
// EXEC SSH
// =====================================

async function execSSH(
  device,
  payload,
  meta = {}
) {

  const command =
    payload.command;

  if (!command) {

    throw new Error(
      "SSH payload missing command"
    );
  }

  const conn =
    await getConnection(
      device
    );

  return new Promise(
    resolve => {

      const start =
        Date.now();

      let stdout =
        "";

      let stderr =
        "";

      let exitCode =
        null;

      let settled =
        false;

      const timeoutMs =
        meta.timeoutMs ||
        15000;

      // ================================
      // SAFE RESOLVE
      // ================================

      function done(
        result
      ) {

        if (settled) {
          return;
        }

        settled = true;

        clearTimeout(
          timeoutRef
        );

        resolve({

          transport:
            "ssh",

          success:
            !!result.success,

          stdout:
            String(
              result.stdout || ""
            ),

          stderr:
            String(
              result.stderr || ""
            ),

          execMs:
            Number(
              result.execMs || 0
            ),

          exitCode:

            result.exitCode ===
            undefined

              ? null

              : result.exitCode,

          error:
            result.error || null
        });
      }

      // ================================
      // TIMEOUT
      // ================================

      const timeoutRef =
        setTimeout(
          () => {

            done({

              success:
                false,

              error:
                "SSH timeout",

              stdout:
                stdout,

              stderr:
                stderr,

              execMs:
                Date.now() - start,

              exitCode:
                null
            });

          },
          timeoutMs
        );

      // ================================
      // EXEC
      // ================================

      conn.exec(
        command,

        (err, stream) => {

          if (err) {

            return done({

              success:
                false,

              error:
                err.message,

              stdout:
                "",

              stderr:
                "",

              execMs:
                Date.now() - start,

              exitCode:
                null
            });
          }

          // ============================
          // STDOUT
          // ============================

          stream.on(
            "data",
            data => {

              stdout +=
                data.toString();
            }
          );

          // ============================
          // STDERR
          // ============================

          stream.stderr.on(
            "data",
            data => {

              stderr +=
                data.toString();
            }
          );

          // ============================
          // EXIT
          // ============================

          stream.on(
            "exit",
            code => {

              exitCode =
                code;
            }
          );

          // ============================
          // CLOSE
          // ============================

          stream.on(
            "close",
            () => {

              const ok =

                exitCode === 0 ||

                (
                  exitCode === null &&
                  stderr.length === 0
                );

              done({

                success:
                  ok,

                error:

                  ok

                    ? null

                    : `SSH exit code: ${exitCode}`,

                stdout,

                stderr,

                execMs:
                  Date.now() - start,

                exitCode
              });
            }
          );
        }
      );
    }
  );
}

// =====================================
// EXECUTE
// =====================================

async function execute(
  device,
  descriptor,
  meta = {}
) {

  return execSSH(

    device,

    descriptor.payload,

    meta
  );
}

// =====================================
// DESTROY ALL CONNECTIONS
// =====================================

function destroyAllConnections() {

  for (
    const conn of
    connectionPool.values()
  ) {

    try {

      conn.end();

    } catch (_) {}
  }

  connectionPool.clear();
}

// =====================================
// EXPORT
// =====================================

module.exports = {

  execute,

  execSSH,

  destroyAllConnections
};
