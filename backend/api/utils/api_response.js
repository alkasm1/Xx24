// backend/api/utils/api_response.js

function ok(
  res,
  data = {},
  meta = {}
) {

  return res.json({
    success: true,

    data,

    meta,

    ts: Date.now()
  });
}

function fail(
  res,
  error,
  code = 500
) {

  return res.status(code).json({
    success: false,

    error:
      typeof error ===
      "string"
        ? error
        : error.message,

    ts: Date.now()
  });
}

module.exports = {
  ok,
  fail
};
