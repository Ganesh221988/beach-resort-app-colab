'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('social_media_accounts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      facebookPageId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      facebookPageName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      facebookAccessToken: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      facebookTokenExpires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      instagramAccountId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      instagramUsername: {
        type: Sequelize.STRING,
        allowNull: true
      },
      instagramAccessToken: {
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

    await queryInterface.addIndex('social_media_accounts', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('social_media_accounts');
  }
};
