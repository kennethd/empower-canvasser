import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { canvas_activity, canvas_activityId } from './canvas_activity';

export interface canvasseeAttributes {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  sms_ok: number;
  street_address?: string;
  created: Date;
}

export type canvasseePk = "id";
export type canvasseeId = canvassee[canvasseePk];
export type canvasseeOptionalAttributes = "id" | "email" | "mobile" | "sms_ok" | "street_address" | "created";
export type canvasseeCreationAttributes = Optional<canvasseeAttributes, canvasseeOptionalAttributes>;

export class canvassee extends Model<canvasseeAttributes, canvasseeCreationAttributes> implements canvasseeAttributes {
  id!: number;
  name!: string;
  email?: string;
  mobile?: string;
  sms_ok!: number;
  street_address?: string;
  created!: Date;

  // canvassee hasMany canvas_activity via canvassee_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof canvassee {
    return canvassee.init({
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
      allowNull: true,
      unique: "idx_canvassee_email"
    },
    mobile: {
      type: DataTypes.STRING(32),
      allowNull: true,
      unique: "idx_canvassee_mobile"
    },
    sms_ok: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    street_address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'canvassee',
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
        name: "idx_canvassee_email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "idx_canvassee_mobile",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "mobile" },
        ]
      },
      {
        name: "idx_canvassee_name",
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  }
}
