"use strict";

const _dirname = process.cwd();

// Import the MongoInterpreter class
const MongoInterpreter = require(_dirname + "/database/interpreter");

module.exports = class DynamicClassRouter {
  constructor() {
    this.mongoInterpreter = new MongoInterpreter();
  }

  async getClassByRouterName(name) {
    if (
      this.mongoInterpreter[name] &&
      typeof this.mongoInterpreter[name] === "function"
    ) {
      return this.mongoInterpreter[name];
    }

    return undefined;
  }
};
