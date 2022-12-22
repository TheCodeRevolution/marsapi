"use strict";

(async () => {
  const Koa = require("koa");
  const { koaBody } = require("koa-body");
  const cors = require('@koa/cors');
  const config = require("./config/config");
  const requestsRouter = require("./router/requests");
  const middleware = require("./router/middleware");
  const session = require("koa-session");
  const passport = require("koa-passport");

  require("dotenv").config();
  require("./utils/Formatter");

  //Define Default APP
  const app = new Koa();

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cors());

  app.use(
    koaBody({
      multipart: true,
    })
  );

  app.use(middleware);

  app.use(requestsRouter.routes());
  
  app.use(session({}, app));


  //Startet den Server
  app.listen(config.nodejsPort, () => {
    console.log(
      `Der Server wurde erfolgreich unter Port ${config.nodejsPort} gestartet.`
    );
  });
})();
