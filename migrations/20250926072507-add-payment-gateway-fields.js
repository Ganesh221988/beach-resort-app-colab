'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add new fields
      await queryInterface.addColumn(
        'payments',
        'gatewayType',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'RAZORPAY'
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'payments',
        'gatewayPaymentId',
        {
          type: Sequelize.STRING,
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'payments',
        'gatewayResponse',
        {
          type: Sequelize.JSON,
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'payments',
        'error',
        {
          type: Sequelize.STRING,
          allowNull: true
        },
        { transaction }
      );

      // Create an index on gatewayPaymentId for faster lookups
      await queryInterface.addIndex(
        'payments',
        ['gatewayPaymentId'],
        {
          name: 'payments_gateway_payment_id_idx',
          transaction
        }
      );

      // Create a composite index on gatewayType and gatewayPaymentId
      await queryInterface.addIndex(
        'payments',
        ['gatewayType', 'gatewayPaymentId'],
        {
          name: 'payments_gateway_type_payment_id_idx',
          transaction
        }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove indexes first
      await queryInterface.removeIndex(
        'payments',
        'payments_gateway_payment_id_idx',
        { transaction }
      );

      await queryInterface.removeIndex(
        'payments',
        'payments_gateway_type_payment_id_idx',
        { transaction }
      );

      // Remove columns
      await queryInterface.removeColumn('payments', 'gatewayType', { transaction });
      await queryInterface.removeColumn('payments', 'gatewayPaymentId', { transaction });
      await queryInterface.removeColumn('payments', 'gatewayResponse', { transaction });
      await queryInterface.removeColumn('payments', 'error', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
