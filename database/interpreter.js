"use strict";

const _dirname = process.cwd();
const zod = require("zod");

const insertOne = zod.object({
  table: zod.string(),
  auth: zod.boolean(),
  body: zod.object({}),
  user: zod.object({}).optional(),
});

const find = zod.object({
  auth: zod.boolean(),
  query: zod.object({}),
  table: zod.string(),
  user: zod.object({}).optional(),
});

module.exports = class MongoInterpreter {
  constructor() {}

  async initDatabase() {
    const MongoConnection = require(_dirname + "/database/mongodb.js");
    let connection = new MongoConnection();
    const database = await connection.init();
    return database;
  }

  async insertOne(request) {
    insertOne.parse(request);

    const database = await this.initDatabase();

    const response = await database
      .collection(request.table)
      .insertOne(request.body);
    console.log(response);
    return response;
  }

  async find(request) {
    find.parse(request);

    const database = await this.initDatabase();

    const result = await database
      .collection(request.table)
      .find(request.query)
      .toArray();
    return result;
  }
};
