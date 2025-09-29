import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Property from "./Property";
import Broker from "./Broker";
import PaymentGateway from "./PaymentGateway";

interface CommissionAttributes {
  id: string;
  propertyId: string;
  brokerId: string;
  amount: number;
  rate: number;
  status: 'PENDING' | 'PAID';
  dueDate: Date;
  paymentGatewayId?: string;
  paymentDetails?: any;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CommissionCreationAttributes extends Optional<CommissionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Commission extends Model<CommissionAttributes, CommissionCreationAttributes> implements CommissionAttributes {
  public id!: string;
  public propertyId!: string;
  public brokerId!: string;
  public amount!: number;
  public rate!: number;
  public status!: 'PENDING' | 'PAID';
  public dueDate!: Date;
  public paymentGatewayId?: string;
  public paymentDetails?: any;
  public notes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public readonly property?: Property;
  public readonly broker?: Broker;
  public readonly paymentGateway?: PaymentGateway;
}

Commission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    brokerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paymentGatewayId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    paymentDetails: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'commissions',
    modelName: 'Commission',
  }
);

// Set up associations
Commission.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property',
});

Commission.belongsTo(Broker, {
  foreignKey: 'brokerId',
  as: 'broker',
});

Commission.belongsTo(PaymentGateway, {
  foreignKey: 'paymentGatewayId',
  as: 'paymentGateway',
});

export default Commission;
