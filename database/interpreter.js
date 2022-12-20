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
  filter: zod.object({}),
  table: zod.string(),
  user: zod.object({}).optional(),
});

const MongoConnection = require(_dirname + "/database/mongodb.js");


const connection = new MongoConnection();

module.exports = class MongoInterpreter {
  constructor() {}

  async insertOne(request) {

    try {
      insertOne.parse(request);

      //Connect to database
      const {client, database} = await connection.init();
  
      const response = await database
        .collection(request.table)
        .insertOne(request.body);

      console.log(response);

    //Close connection after Action
    client.close();

      return response;
    } catch (error) {
      return { error };
    }
  }

  async find(request) {
    try {
      find.parse(request);
      
      //Connect to database
      const {client, database} = await connection.init();

      const result = await database
        .collection(request.table)
        .find(request.query)
        .toArray();


        //Close connection after Action
        client.close();

      return result;
    } catch (error) {
      return { error };
    }
  }
};
