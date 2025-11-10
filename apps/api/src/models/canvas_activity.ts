import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { canvassee, canvasseeId } from './canvassee';
import type { canvasser, canvasserId } from './canvasser';

export interface canvas_activityAttributes {
  id: number;
  canvasser_id: number;
  canvassee_id: number;
  notes?: string;
  created: Date;
}

export type canvas_activityPk = "id";
export type canvas_activityId = canvas_activity[canvas_activityPk];
export type canvas_activityOptionalAttributes = "id" | "notes" | "created";
export type canvas_activityCreationAttributes = Optional<canvas_activityAttributes, canvas_activityOptionalAttributes>;

export class canvas_activity extends Model<canvas_activityAttributes, canvas_activityCreationAttributes> implements canvas_activityAttributes {
  id!: number;
  canvasser_id!: number;
  canvassee_id!: number;
  notes?: string;
  created!: Date;

  // canvas_activity belongsTo canvassee via canvassee_id
  canvassee!: canvassee;
  getCanvassee!: Sequelize.BelongsToGetAssociationMixin<canvassee>;
  setCanvassee!: Sequelize.BelongsToSetAssociationMixin<canvassee, canvasseeId>;
  createCanvassee!: Sequelize.BelongsToCreateAssociationMixin<canvassee>;
  // canvas_activity belongsTo canvasser via canvasser_id
  canvasser!: canvasser;
  getCanvasser!: Sequelize.BelongsToGetAssociationMixin<canvasser>;
  setCanvasser!: Sequelize.BelongsToSetAssociationMixin<canvasser, canvasserId>;
  createCanvasser!: Sequelize.BelongsToCreateAssociationMixin<canvasser>;

  static initModel(sequelize: Sequelize.Sequelize): typeof canvas_activity {
    return canvas_activity.init({
    id: {
      autoIncrement: true,
      type: DataTypes.MEDIUMINT,
      allowNull: false,
      primaryKey: true
    },
    canvasser_id: {
      type: DataTypes.MEDIUMINT,
      allowNull: false,
      references: {
        model: 'canvasser',
        key: 'id'
      }
    },
    canvassee_id: {
      type: DataTypes.MEDIUMINT,
      allowNull: false,
      references: {
        model: 'canvassee',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'canvas_activity',
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
        name: "canvasser_id",
        using: "BTREE",
        fields: [
          { name: "canvasser_id" },
        ]
      },
      {
        name: "canvassee_id",
        using: "BTREE",
        fields: [
          { name: "canvassee_id" },
        ]
      },
      {
        name: "idx_canvas_activity_created",
        using: "BTREE",
        fields: [
          { name: "created" },
        ]
      },
      {
        name: "idx_canvas_activity_notes",
        type: "FULLTEXT",
        fields: [
          { name: "notes" },
        ]
      },
    ]
  });
  }
}
