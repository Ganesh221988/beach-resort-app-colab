'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Create commissions table
      await queryInterface.createTable('commissions', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        propertyId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'properties',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        brokerId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'brokers',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        rate: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: false,
          comment: 'Commission rate in percentage'
        },
        status: {
          type: Sequelize.ENUM('PENDING', 'PAID'),
          allowNull: false,
          defaultValue: 'PENDING'
        },
        dueDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        paymentGatewayId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'payment_gateways',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        paymentDetails: {
          type: Sequelize.JSON,
          allowNull: true
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // Add indexes
      await queryInterface.addIndex('commissions', ['brokerId', 'status'], {
        name: 'idx_commissions_broker_status',
        transaction
      });

      await queryInterface.addIndex('commissions', ['propertyId'], {
        name: 'idx_commissions_property',
        transaction
      });

      await queryInterface.addIndex('commissions', ['dueDate'], {
        name: 'idx_commissions_due_date',
        transaction
      });

      // Add commission_rate field to payment_gateways table
      await queryInterface.addColumn('payment_gateways', 'commission_rate', {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Default commission rate for the gateway owner'
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('payment_gateways', 'commission_rate', { transaction });
      await queryInterface.removeIndex('commissions', 'idx_commissions_broker_status', { transaction });
      await queryInterface.removeIndex('commissions', 'idx_commissions_property', { transaction });
      await queryInterface.removeIndex('commissions', 'idx_commissions_due_date', { transaction });
      await queryInterface.dropTable('commissions', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
