'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop foreign key constraints first
    await queryInterface.removeConstraint('Subscriptions', 'subscriptions_ibfk_1').catch(() => {});
    await queryInterface.removeConstraint('Bookings', 'bookings_ibfk_1').catch(() => {});
    await queryInterface.removeConstraint('Properties', 'properties_ibfk_1').catch(() => {});

    // Create new UUID column
    await queryInterface.addColumn('Users', 'uuid', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: true
    }).catch(() => {});

    // Generate UUIDs for existing users
    await queryInterface.sequelize.query(`
      UPDATE Users 
      SET uuid = UUID()
      WHERE uuid IS NULL;
    `);

    // Drop old id column and rename uuid to id
    await queryInterface.removeColumn('Users', 'id').catch(() => {});
    await queryInterface.renameColumn('Users', 'uuid', 'id').catch(() => {});

    // Add primary key constraint
    await queryInterface.addConstraint('Users', {
      fields: ['id'],
      type: 'primary key'
    }).catch(() => {});

    // Add foreign key constraints back
    await queryInterface.addConstraint('Subscriptions', {
      fields: ['ownerId'],
      type: 'foreign key',
      name: 'subscriptions_ibfk_1',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }).catch(() => {});

    await queryInterface.addConstraint('Bookings', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'bookings_ibfk_1',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }).catch(() => {});

    await queryInterface.addConstraint('Properties', {
      fields: ['ownerId'],
      type: 'foreign key',
      name: 'properties_ibfk_1',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }).catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    // Unfortunately, we cannot revert this migration as we would lose the UUIDs
    // and potentially break data relationships
    console.log('This migration cannot be reverted');
  }
};
