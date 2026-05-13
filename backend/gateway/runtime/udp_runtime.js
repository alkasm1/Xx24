// backend/gateway/runtime/udp_runtime.js

const dgram =
  require("dgram");

const crypto =
  require("crypto");

const udp =
  dgram.createSocket("udp4");

const SECRET =
  "alm_shared_secret";

function stableStringify(
  obj
) {

  if (
    obj === null ||
    typeof obj !==
      "object"
  ) {

    return JSON.stringify(
      obj
    );
  }

  if (
    Array.isArray(obj)
  ) {

    return (
      "[" +
      obj
        .map(
          stableStringify
        )
        .join(",") +
      "]"
    );
  }

  return (
    "{" +
    Object.keys(obj)
      .sort()
      .map(
        k =>
          JSON.stringify(k) +
          ":" +
          stableStringify(
            obj[k]
          )
      )
      .join(",") +
    "}"
  );
}

function signPacket(
  packet
) {

  return crypto
    .createHmac(
      "sha256",
      SECRET
    )
    .update(
      stableStringify(
        packet
      )
    )
    .digest("hex");
}

function verifySignature(
  packet
) {

  const sig =
    packet.sig;

  const base = {
    ...packet
  };

  delete base.sig;

  return (
    signPacket(base) ===
    sig
  );
}

function startUDPRuntime({

  registry,
  sendToUI
}) {

  udp.on(
    "message",

    (
      buf,
      rinfo
    ) => {

      let packet;

      try {

        packet =
          JSON.parse(
            buf.toString()
          );

      } catch {

        return;
      }

      if (
        !verifySignature(
          packet
        )
      ) {

        console.log(
          "❌ Invalid signature → dropped"
        );

        return;
      }

      if (
        packet.type ===
        "heartbeat"
      ) {

        const existing =
          registry.get(
            packet.deviceId
          );

        if (existing) {

          registry.update(
            packet.deviceId,
            {
              ip:
                rinfo.address,

              port:
                rinfo.port,

              lastSeen:
                Date.now(),

              status:
                "online"
            }
          );

        } else {

          registry.upsert(
            packet.deviceId,
            {
              deviceId:
                packet.deviceId,

              ip:
                rinfo.address,

              port:
                rinfo.port,

              method:
                "udp",

              profile:
                "unknown",

              vendor:
                "unknown",

              status:
                "online",

              lastSeen:
                Date.now(),

              capabilities:
                []
            }
          );
        }

        return;
      }

      if (
        packet.type ===
        "ack"
      ) {

        sendToUI({
          type: "terminal",
          line:
            `ACK ${packet.requestId}`
        });
      }
    }
  );

  udp.bind(5000);

  console.log(
    "📡 UDP runtime started"
  );

  return udp;
}

module.exports = {
  startUDPRuntime
};
