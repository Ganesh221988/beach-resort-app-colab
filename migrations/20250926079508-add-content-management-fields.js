'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to Properties table
    await queryInterface.addColumn('Properties', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });

    await queryInterface.addColumn('Properties', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: ''
    });

    await queryInterface.addColumn('Properties', 'images', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addColumn('Properties', 'imageBlurHashes', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addColumn('Properties', 'keywords', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addColumn('Properties', 'seoMetadata', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Properties', 'title');
    await queryInterface.removeColumn('Properties', 'description');
    await queryInterface.removeColumn('Properties', 'images');
    await queryInterface.removeColumn('Properties', 'imageBlurHashes');
    await queryInterface.removeColumn('Properties', 'keywords');
    await queryInterface.removeColumn('Properties', 'seoMetadata');
  }
};
