import Sequelize from "sequelize"
import { initModels } from "./init-models.ts";

const sequelize = new Sequelize(process.env.DBNAME,
                                process.env.DBUSER,
                                process.env.DBPASS, {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
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

export const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  models: initModels(sequelize)
};

