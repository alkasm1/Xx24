// backend/api/controllers/runtime.controller.js

const registry =
  require(
    "../../gateway/device_registry"
  );

const {
  ok,
  fail
} = require(
  "../utils/api_response"
);

function getSnapshot(
  req,
  res
) {

  try {

    const devices =
      registry.getAll();

    return ok(
      res,
      {
        devices
      }
    );

  } catch (err) {

    return fail(
      res,
      err
    );
  }
}

function getDevices(
  req,
  res
) {

  try {

    return ok(
      res,
      registry.getAll()
    );

  } catch (err) {

    return fail(
      res,
      err
    );
  }
}

function getDevice(
  req,
  res
) {

  try {

    const device =
      registry.get(
        req.params.id
      );

    if (!device) {

      return fail(
        res,
        "Device not found",
        404
      );
    }

    return ok(
      res,
      device
    );

  } catch (err) {

    return fail(
      res,
      err
    );
  }
}

module.exports = {

  getSnapshot,

  getDevices,

  getDevice
};
