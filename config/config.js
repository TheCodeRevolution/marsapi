"use strict";

require("dotenv").config();

const config = {
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    credentials: {
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
    database: process.env.DATABASE_NAME,
  },
  nodejsPort: process.env.SERVER_PORT,
  modules: {
    auth: {
      googleAuth: false,
      register: true,
      login: true,
      secretToken: process.env.SECRET_TOKEN,
    },
    roles: {
      default: "user",
      highest: "admin",
    },
  },
};

module.exports = config;
