// backend/gateway/transports/ssh_adapter.js

const {
  Client
} = require("ssh2");

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

  return new Promise(
    (resolve) => {

      const conn =
        new Client();

      const start =
        Date.now();

      let stdout = "";
      let stderr = "";

      let settled =
        false;

      // =================================
      // SAFE RESOLVE
      // =================================

      function done(
        result
      ) {

        if (settled) {
          return;
        }

        settled = true;

        try {
          conn.end();
        } catch (_) {}

        resolve({

          transport:
            "ssh",

          success:
            !!result.success,

          stdout:
            stdout ||

            result.stdout ||

            "",

          stderr:
            stderr ||

            result.stderr ||

            "",

          execMs:
            Date.now() - start,

          exitCode:
            result.exitCode ??
            null,

          error:
            result.error ||
            null
        });
      }

      // =================================
      // TIMEOUT
      // =================================

      const timeoutMs =
        meta.timeoutMs ||
        15000;

      const timeout =
        setTimeout(
          () => {

            done({

              success: false,

              error:
                "SSH timeout"
            });

          },
          timeoutMs
        );

      // =================================
      // READY
      // =================================

      conn.on(
        "ready",
        () => {

          conn.exec(
            command,

            (
              err,
              stream
            ) => {

              if (err) {

                clearTimeout(
                  timeout
                );

                return done({

                  success:
                    false,

                  error:
                    err.message
                });
              }

              // =========================
              // STDOUT
              // =========================

              stream.on(
                "data",
                data => {

                  stdout +=
                    data.toString();
                }
              );

              // =========================
              // STDERR
              // =========================

              stream.stderr.on(
                "data",
                data => {

                  stderr +=
                    data.toString();
                }
              );

              // =========================
              // CLOSE
              // =========================

              stream.on(
                "close",
                code => {

                  clearTimeout(
                    timeout
                  );

                  done({

                    success:
                      code === 0,

                    exitCode:
                      code
                  });
                }
              );
            }
          );
        }
      );

      // =================================
      // ERROR
      // =================================

      conn.on(
        "error",
        err => {

          clearTimeout(
            timeout
          );

          done({

            success:
              false,

            error:
              err.message
          });
        }
      );

      // =================================
      // CONNECT
      // =================================

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

module.exports = {

  execute,

  execSSH
};
