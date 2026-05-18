module.exports = {

  opcode:
    "system.capabilities",

  name:
    "Runtime Capabilities",

  profiles: [
    "linux"
  ],

  transport:
    "ssh",

  timeout:
    10000,

  parser:
    "json",

  buildDescriptor({

    device

  }) {

    return {

      type:
        "command",

      transport:
        "ssh",

      payload: {

        command: `
echo '{
  "runtime":"alm",
  "profile":"linux",
  "capabilities":[
    "system.exec",
    "system.getIdentity",
    "system.hostname",
    "system.uptime",
    "system.capabilities"
  ]
}'
`
      },

      parser:
        "json",

      timeout:
        10000
    };
  }
};
