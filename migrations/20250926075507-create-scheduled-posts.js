'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('scheduled_posts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      propertyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Properties',
          key: 'id'
        }
      },
      platforms: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      scheduledTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'published', 'failed'),
        defaultValue: 'pending'
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('scheduled_posts', ['userId']);
    await queryInterface.addIndex('scheduled_posts', ['propertyId']);
    await queryInterface.addIndex('scheduled_posts', ['status', 'scheduledTime']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('scheduled_posts');
  }
};
