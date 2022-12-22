"use strict";

const path = require("path");
const zod = require("zod");


//Schema um die insertOne Request zu validieren
const insertOneSchema = zod.object({
  table: zod.string(),
  body: zod.object({}),
  user: zod.object({}).optional(),
});

//Schema um die find Request zu validieren
const findSchema = zod.object({
  filter: zod.object({}),
  table: zod.string(),
  user: zod.object({}).optional(),
});

//Schema um die update Request zu validieren
const update = zod.object({
  table: zod.string(),
  body: zod.object({}),
  filter: zod
    .object({
      _id: zod.string().optional(),
    })
    .optional(),
  cmd: zod.object({}).optional(),
  options: zod.object({}).optional(),
  user: zod.object({}).optional(),
});

//Schema um die count Request zu validieren
const count = zod.object({
  table: zod.string(),
  filter: zod.object({}),
  user: zod.object({}).optional(),
});


//Schema um die delete Request zu validieren
const _delete = zod.object({
  table: zod.string(),
  filter: zod.object({}),
  user: zod.object({}).optional(),
});

const MongoConnection = require(path.join(__dirname, "mongodb.js"));

class MongoInterpreter {
  constructor() {}

  async insertOne(request) {
    try {
      insertOneSchema.parse(request);

      if (Object.keys(request.body).length === 0) throw "Body Empty";

      const connection = new MongoConnection();
      const { client, database } = await connection.init();

      const response = await database
        .collection(request.table)
        .insertOne(request.body);

      client.close();
      return response;
    } catch (error) {
      return { error };
    }
  }

  async find(request) {
    try {
      findSchema.parse(request);

      const connection = new MongoConnection();
      const { client, database } = await connection.init();

      const result = await database
        .collection(request.table)
        .find(request.filter)
        .toArray();

      client.close();
      return result;
    } catch (error) {
      return { error };
    }
  }

  async update(request) {
    try {
      update.parse(request);

      if (Object.keys(request.filter).length === 0) throw "Filter Empty";

      const connection = new MongoConnection();
      const { client, database } = await connection.init();

      const result = await database
        .collection(request.table)
        .updateOne(
          request.filter,
          request.cmd ? request.cmd : { $set: request.body || {} },
          request.options || { upsert: true }
        );

      client.close();
      return result;
    } catch (error) {
      return { error };
    }
  }

  async count(request) {
    try {
      count.parse(request);

      const connection = new MongoConnection();
      const { client, database } = await connection.init();

      const result = await database
        .collection(request.table)
        .count(request.filter);

      client.close();
      return result;
    } catch (error) {
      return { error };
    }
  }

  async _delete(request) {
    try {
      _delete.parse(request);

      if (Object.keys(request.filter).length === 0) throw "Filter Empty";

      const connection = new MongoConnection();
      const { client, database } = await connection.init();

      const result = await database
        .collection(request.table)
        .deleteOne(request.filter);

      client.close();
      return result;
    } catch (error) {
      return { error };
    }
  }
}

module.exports = MongoInterpreter;
