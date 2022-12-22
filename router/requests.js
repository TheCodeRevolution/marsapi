"use strict";
const _dirname = process.cwd();
const DynamicClassRouter = require(_dirname + "/router/DynamicClassRouter");

const requestconfig = require(_dirname + "/config/requestconfig");

const Router = require("koa-router");
const router = new Router({
  prefix: "/api",
});

const classRouter = new DynamicClassRouter();

module.exports = router.post("/endpoint/:action", async (ctx) => {
  let action = ctx.params.action;

  // Prüft ob der Benutzer angemeldet ist
  if (!ctx.isAuthenticated()) {
    ctx.status = 400;
    ctx.body = { error: "Not authorized" };
    return;
  }

  //Prüft ob der Table in der Config eingetragen ist
  if (
    !ctx.request.body.table ||
    !Object.keys(requestconfig).includes(ctx.request.body.table)
  ) {
    ctx.status = 400;
    ctx.body = { error: "Undefinded table" };
    return;
  }

  //Prüft die Berechtigung des Tables
  const tableConfiguration = requestconfig[ctx.request.body.table];
  if (tableConfiguration.needPermissions) {
    const user = ctx.state.user;

    //Schauen ob der Benutzer existiert
    if (!user) {
      ctx.status = 400;
      ctx.body = { error: "Error while send request: 2001" };
      return;
    }

    if (
      !user.permissions.some((value) =>
        tableConfiguration.permissions.includes(value)
      )
    ) {
      ctx.status = 400;
      ctx.body = { error: "Error while send request: 2000" };
      return;
    }
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
