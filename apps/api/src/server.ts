import { db } from "./models/index.ts";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import express, { type Express } from "express";

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

    .get('/activities', function(req, res) {
      const opts = {
        include: [
          { association: 'canvasser', required: true, },
          { association: 'canvassee', required: true, },
        ],
      };
      db.models.canvas_activity.findAll(opts).then(activities => res.json(activities));
    })

    .get('/canvassees', function(req, res) {
      db.models.canvassee.findAll().then(canvassees => res.json(canvassees));
    })

    .put('/canvassees', function(req, res) {
      // TODO: raise error if name is empty
      // TODO: try/catch
      db.models.canvassee.create({
        name: req.body.name,
        email: req.body.email,
        moblie: req.body.mobile,
        sms_ok: req.body.sms_ok,
        street_address: req.body.street_address,
      }).then(function(canvassee) {
        res.json(canvassee);
      });
    })

    .get('/canvassers', function(req, res) {
      db.models.canvasser.findAll().then(canvassers => res.json(canvassers));
    })

  ;
  return app;
};
