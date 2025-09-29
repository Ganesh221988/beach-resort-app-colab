'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('brokers', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        approved: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        }
      }, { transaction });

      // Add indexes
      await queryInterface.addIndex('brokers', ['email'], {
        name: 'idx_brokers_email',
        unique: true,
        transaction
      });

      await queryInterface.addIndex('brokers', ['approved'], {
        name: 'idx_brokers_approved',
        transaction
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeIndex('brokers', 'idx_brokers_email', { transaction });
      await queryInterface.removeIndex('brokers', 'idx_brokers_approved', { transaction });
      await queryInterface.dropTable('brokers', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
