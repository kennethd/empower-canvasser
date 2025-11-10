import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";

const corsOptions = {
  // TODO: hardcoded port bad.
  // next.js frontend listens on 3002
  origin: "http://localhost:3002"
};

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    // https://expressjs.com/en/resources/middleware/morgan.html
    .use(morgan("dev"))
    // parse requests of content-type - application/x-www-form-urlencoded
    .use(urlencoded({ extended: true }))
    // parse requests of content-type - application/jso
    .use(json())
    // accept requests from next.js fornt-end app
    .use(cors(corsOptions))
    // heartbeat
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    // welcome message
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })


  ;
  return app;
};
