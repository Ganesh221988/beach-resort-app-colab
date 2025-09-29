import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Commission from "./Commission";
import Property from "./Property";

interface BrokerAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BrokerCreationAttributes extends Optional<BrokerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Broker extends Model<BrokerAttributes, BrokerCreationAttributes> implements BrokerAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public phone!: string;
  public approved!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public readonly commissions?: Commission[];
  public readonly properties?: Property[];
}

Broker.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'brokers',
    modelName: 'Broker',
  }
);

// Set up associations
Broker.hasMany(Commission, {
  foreignKey: 'brokerId',
  as: 'commissions',
});

Broker.hasMany(Property, {
  foreignKey: 'brokerId',
  as: 'properties',
});

export default Broker;
