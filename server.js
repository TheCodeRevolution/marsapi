"use strict";

(async () => {
  const Koa = require("koa");
  const { koaBody } = require("koa-body");
  const config = require("./config/config");
  const router = require("./router/requests");

  require("dotenv").config();
  require("./utils/Formatter");

  //Define Default APP
  const app = new Koa();

  app.use(
    koaBody({
      multipart: true,
    })
  );

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(config.nodejsPort, () => {
    console.log(
      `Der Server wurde erfolgreich unter Port ${config.nodejsPort} gestartet.`
    );
  });
})();
