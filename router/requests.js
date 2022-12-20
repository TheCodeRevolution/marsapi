"use strict";
const _dirname = process.cwd();
const DynamicClassRouter = require(_dirname + "/router/DynamicClassRouter");
const Router = require("koa-router");
const router = new Router({
  prefix: "/api",
});

const classRouter = new DynamicClassRouter();

router.post("/endpoint/:action", async (ctx) => {
  let action = ctx.params.action;

  const mongoAction = await classRouter.getClassByRouterName(action);

  if (mongoAction === undefined) {
    ctx.status = 400;
    ctx.body = JSON.stringify({
      error: "Undefinded action",
    });
    return;
  }

  const data = await mongoAction(ctx.request.body);
  console.log(data);

  ctx.status = data.error ? 400 : 200;
  ctx.body = data;
});

module.exports = router;
