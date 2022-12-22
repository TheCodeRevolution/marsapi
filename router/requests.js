"use strict";
const _dirname = process.cwd();
const DynamicClassRouter = require(_dirname + "/router/DynamicClassRouter");
const Router = require("koa-router");
const router = new Router({
  prefix: "/api",
});

const classRouter = new DynamicClassRouter();

module.exports = router.post("/endpoint/:action", async (ctx) => {
  let action = ctx.params.action;

  //Prüft ob der Benutzer angemeldet ist
  if(!ctx.isAuthenticated()){
    ctx.status = 400;
    ctx.body = { error: "Not authorized" };
    return;
  }


  //Lädt die Mongo aktion aus dem Request
  const mongoAction = await classRouter.getClassByRouterName(action);

  //Schauen ob die Mongodb Aktion gefunden wurde
  if (mongoAction === undefined) {
    ctx.status = 400;
    ctx.body = { error: "Undefinded action" };
    return;
  }

  const data = await mongoAction(ctx.request.body);

  //Schauen ob Daten aus dem request gefunden wurden.
  if (data.length === 0) {
    ctx.status = 400;
    ctx.body = { error: "No document found" };
    return;
  }

  //Sendet die gefundenen Daten oder einen Error an den Client
  ctx.status = data.error ? 400 : 200;
  ctx.body = data;
});
