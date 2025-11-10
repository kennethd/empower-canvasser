import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { canvas_activity, canvas_activityId } from './canvas_activity';

export interface canvasserAttributes {
  id: number;
  name: string;
  email: string;
  mobile: string;
  created: Date;
}

export type canvasserPk = "id";
export type canvasserId = canvasser[canvasserPk];
export type canvasserOptionalAttributes = "id" | "created";
export type canvasserCreationAttributes = Optional<canvasserAttributes, canvasserOptionalAttributes>;

export class canvasser extends Model<canvasserAttributes, canvasserCreationAttributes> implements canvasserAttributes {
  id!: number;
  name!: string;
  email!: string;
  mobile!: string;
  created!: Date;

  // canvasser hasMany canvas_activity via canvasser_id
  canvas_activities!: canvas_activity[];
  getCanvas_activities!: Sequelize.HasManyGetAssociationsMixin<canvas_activity>;
  setCanvas_activities!: Sequelize.HasManySetAssociationsMixin<canvas_activity, canvas_activityId>;
  addCanvas_activity!: Sequelize.HasManyAddAssociationMixin<canvas_activity, canvas_activityId>;
  addCanvas_activities!: Sequelize.HasManyAddAssociationsMixin<canvas_activity, canvas_activityId>;
  createCanvas_activity!: Sequelize.HasManyCreateAssociationMixin<canvas_activity>;
  removeCanvas_activity!: Sequelize.HasManyRemoveAssociationMixin<canvas_activity, canvas_activityId>;
  removeCanvas_activities!: Sequelize.HasManyRemoveAssociationsMixin<canvas_activity, canvas_activityId>;
  hasCanvas_activity!: Sequelize.HasManyHasAssociationMixin<canvas_activity, canvas_activityId>;
  hasCanvas_activities!: Sequelize.HasManyHasAssociationsMixin<canvas_activity, canvas_activityId>;
  countCanvas_activities!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof canvasser {
    return canvasser.init({
    id: {
      autoIncrement: true,
      type: DataTypes.MEDIUMINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: "idx_canvasser_email"
    },
    mobile: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'canvasser',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_canvasser_email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "idx_canvasser_name",
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  }
}
