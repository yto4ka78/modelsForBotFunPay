import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.FunpayAccount, {
        as: "funpayAccount",
        foreignKey: { name: "funpayAccountId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.Service, {
        as: "service",
        foreignKey: { name: "serviceId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.PoolSteamAccount, {
        as: "poolSteamAccount",
        foreignKey: { name: "poolSteamAccountId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      funpayAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      serviceId: {
        type: DataTypes.UUID,
      },
      timeOutRental: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      poolSteamAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
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
      modelName: "Order",
      tableName: "orders",
      underscored: true,
      defaultScope: {
        attributes: { exclude: [] },
      },
    }
  );
  return Order;
};
