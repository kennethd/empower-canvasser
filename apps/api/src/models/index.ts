import type { Sequelize } from "sequelize";
import { DBHOST, DBPORT, DBPORT, DBUSER, DBPASS } from "../../dbconfig.ts";
import { initModels } from "./init-models.ts";

const sequelize = new Sequelize(DBNAME, DBUSER, DBPASS, {
  host: DBHOST,
  port: DBPORT,
  dialect: "mysql",
  pool: {
    // max connections in pool
    max: 6,
    // min connections in pool
    min: 0,
    // ms to wait for connection before raising error
    acquire: 10000,
    // ms conn allowed to be idle
    idle: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = initModels(sequelize);

module.exports = db;
