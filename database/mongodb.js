"use strict";

const _dirname  = process.cwd()
const config = require(_dirname + "/config/config");

module.exports = class MongoConnection {
  constructor() {}

  async init() {
    const { MongoClient } = require("mongodb");

    let url = `mongodb://${config.database.host}:${config.database.port}/${config.database.name}`;

    if (
      config.database.credentials &&
      config.database.credentials.username &&
      config.database.credentials.password
    )
      url = `mongodb://${config.database.credentials.username}:${config.database.credentials.password}@${config.database.host}:${config.database.port}/${config.database.name}`;

    const client = new MongoClient(url);

    const dbName = config.database.database || "MarsAPI";

    await client.connect();
    const database = client.db(dbName);

    return {client, database};
  }
};
