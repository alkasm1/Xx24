const {
  dispatch
} = require(
  "../dispatcher"
);

// =====================================
// DISCOVER DEVICE
// =====================================

async function discoverDeviceCapabilities(

  device,
  registry

) {

  try {

    const result =
      await dispatch(

        device,

        "system.capabilities"
      );

    if (
      !result.success
    ) {

      return false;
    }

    let parsed = null;

    try {

      parsed =
        JSON.parse(
          result.stdout
        );

    } catch {

      return false;
    }

    registry.update(

      device.deviceId,

      {

        capabilities:

          parsed.capabilities ||

          [],

        runtime:

          parsed.runtime ||

          "unknown",

        profile:

          parsed.profile ||

          device.profile
      }
    );

    console.log(

      "🧠 Runtime discovered:",

      device.deviceId,

      parsed.capabilities
    );

    return true;

  } catch (err) {

    console.log(

      "❌ Runtime discovery failed:",

      err.message
    );

    return false;
  }
}

module.exports = {

  discoverDeviceCapabilities
};
