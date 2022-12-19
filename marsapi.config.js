module.exports = {
  apps: [
    {
      name: "MarsAPI",
      script: "./server.js",
      noAutorestart: true,
      watch: true,
      logs: true,
      ignore_watch: [
        "node_modules",
      ],
      env: {
        DEBUG: "server:*",
      },
    },
  ],
};
