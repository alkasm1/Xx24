module.exports = {

  opcode:
    "system.info",

  name:
    "System Information",

  profiles: [
    "linux"
  ],

  transport:
    "ssh",

  timeout:
    10000,

  parser:
    "text",

  buildDescriptor() {

    return {

      type:
        "command",

      transport:
        "ssh",

      payload: {

        command:
`
echo "HOSTNAME:"
hostname

echo ""
echo "UPTIME:"
uptime

echo ""
echo "KERNEL:"
uname -a
`
      },

      parser:
        "text",

      timeout:
        10000
    };
  }
};
