import type { Sequelize } from "sequelize";
import { canvas_activity as _canvas_activity } from "./canvas_activity";
import type { canvas_activityAttributes, canvas_activityCreationAttributes } from "./canvas_activity";
import { canvassee as _canvassee } from "./canvassee";
import type { canvasseeAttributes, canvasseeCreationAttributes } from "./canvassee";
import { canvasser as _canvasser } from "./canvasser";
import type { canvasserAttributes, canvasserCreationAttributes } from "./canvasser";

export {
  _canvas_activity as canvas_activity,
  _canvassee as canvassee,
  _canvasser as canvasser,
};

export type {
  canvas_activityAttributes,
  canvas_activityCreationAttributes,
  canvasseeAttributes,
  canvasseeCreationAttributes,
  canvasserAttributes,
  canvasserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const canvas_activity = _canvas_activity.initModel(sequelize);
  const canvassee = _canvassee.initModel(sequelize);
  const canvasser = _canvasser.initModel(sequelize);

  canvas_activity.belongsTo(canvassee, { as: "canvassee", foreignKey: "canvassee_id"});
  canvassee.hasMany(canvas_activity, { as: "canvas_activities", foreignKey: "canvassee_id"});
  canvas_activity.belongsTo(canvasser, { as: "canvasser", foreignKey: "canvasser_id"});
  canvasser.hasMany(canvas_activity, { as: "canvas_activities", foreignKey: "canvasser_id"});

  return {
    canvas_activity: canvas_activity,
    canvassee: canvassee,
    canvasser: canvasser,
  };
}
