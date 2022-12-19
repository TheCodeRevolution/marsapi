"use strict";

const _dirname = process.cwd();
const MongoInterpreter = require(_dirname + "/database/interpreter");
const Router = require("koa-router");
const router = new Router({
    prefix: "/api",
});

router.post("/endpoint", (ctx) => {
  let interpreter = new MongoInterpreter();
  interpreter.find(ctx.request.body);
});

module.exports = router;
