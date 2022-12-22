"use strict";

const _dirname = process.cwd();
const config = require(_dirname + "/config/config");

async function middleware(ctx, next) {


  //Prüfen ob der Client über https verbindet
  if (config.forceHttps) {
    if (ctx.protocol !== "https") {
      ctx.status = 400;
      ctx.body = { error: "Insecure connection" };
      return;
    }
  }

  // Prüfen, ob der Request bestimmte Header enthält (z.B. X-XSS-Protection)
  if (!checkHeaders(ctx)) return;

  await next();
}

const checkHeaders = (ctx) => {
  // Prüfen, ob der X-XSS-Protection-Header vorhanden ist und den erwarteten Wert hat
  if (
    !ctx.request.headers["x-xss-protection"] ||
    ctx.request.headers["x-xss-protection"] !== "1; mode=block"
  ) {
    ctx.status = 400;
    ctx.body = { error: "Insecure Action Code: 1000" };
    return false;
  }

  return true;
};

module.exports = middleware;
