'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing tables in the correct order
    await queryInterface.dropTable('Subscriptions').catch(() => {});
    await queryInterface.dropTable('Bookings').catch(() => {});
    await queryInterface.dropTable('Properties').catch(() => {});
    await queryInterface.dropTable('Users').catch(() => {});

    // Create Users table first
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'OWNER', 'CUSTOMER', 'BROKER'),
        allowNull: false,
        defaultValue: 'CUSTOMER'
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      documents: {
        type: Sequelize.JSON,
        allowNull: true
      },
      profileData: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Properties table
    await queryInterface.createTable('Properties', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      propertyType: {
        type: Sequelize.ENUM('HOTEL', 'RESORT', 'VILLA', 'APARTMENT', 'HOMESTAY'),
        allowNull: false,
        defaultValue: 'HOTEL'
      },
      amenities: {
        type: Sequelize.JSON,
        allowNull: true
      },
      events: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      mediaUrls: {
        type: Sequelize.JSON,
        allowNull: true
      },
      ownerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Bookings table
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      propertyId: {
        type: Sequelize.UUID,
        references: {
          model: 'Properties',
          key: 'id'
        },
        allowNull: false
      },
      customerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      },
      brokerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isHourly: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      commission: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
        defaultValue: 'PENDING'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Subscriptions table
    await queryInterface.createTable('Subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      ownerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      },
      planType: {
        type: Sequelize.ENUM('BASIC', 'PREMIUM', 'ENTERPRISE'),
        allowNull: false
      },
      paymentType: {
        type: Sequelize.ENUM('FLAT_RATE', 'COMMISSION'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'EXPIRED'),
        defaultValue: 'PENDING'
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    const addColumnIfNotExists = async (tableName, columnName, columnDefinition) => {
      try {
        await queryInterface.addColumn(tableName, columnName, columnDefinition);
      } catch (error) {
        if (error.name === 'SequelizeDatabaseError' && error.message.includes('Duplicate column name')) {
          console.log(`Column ${columnName} already exists in ${tableName}`);
        } else {
          throw error;
        }
      }
    };

    // Create Users table if it doesn't exist
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).catch(error => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log('Users table already exists');
      } else {
        throw error;
      }
    });

    // Create Properties table if it doesn't exist
    await queryInterface.createTable('Properties', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ownerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).catch(error => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log('Properties table already exists');
      } else {
        throw error;
      }
    });

    // Create Bookings table if it doesn't exist
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      propertyId: {
        type: Sequelize.UUID,
        references: {
          model: 'Properties',
          key: 'id'
        },
        allowNull: false
      },
      customerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
        defaultValue: 'PENDING'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).catch(error => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log('Bookings table already exists');
      } else {
        throw error;
      }
    });

    // Add new columns to Properties table
    await addColumnIfNotExists('Properties', 'propertyType', {
      type: Sequelize.ENUM('HOTEL', 'RESORT', 'VILLA', 'APARTMENT', 'HOMESTAY'),
      allowNull: false,
      defaultValue: 'HOTEL'
    });

    await addColumnIfNotExists('Properties', 'amenities', {
      type: Sequelize.JSON,
      allowNull: true
    });

    await addColumnIfNotExists('Properties', 'events', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await addColumnIfNotExists('Properties', 'mediaUrls', {
      type: Sequelize.JSON,
      allowNull: true
    });

    // Create Subscriptions table
    try {
      await queryInterface.createTable('Subscriptions', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        ownerId: {
          type: Sequelize.UUID,
          references: {
            model: 'Users',
            key: 'id'
          },
          allowNull: false
        },
        planType: {
          type: Sequelize.ENUM('BASIC', 'PREMIUM', 'ENTERPRISE'),
          allowNull: false
        },
        paymentType: {
          type: Sequelize.ENUM('FLAT_RATE', 'COMMISSION'),
          allowNull: false
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'EXPIRED'),
          defaultValue: 'PENDING'
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log('Subscriptions table already exists');
      } else {
        throw error;
      }
    }

    // Add new columns to Bookings table
    await addColumnIfNotExists('Bookings', 'brokerId', {
      type: Sequelize.UUID,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: true
    });

    await addColumnIfNotExists('Bookings', 'isHourly', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await addColumnIfNotExists('Bookings', 'commission', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });

    // Add new columns to Users table
    await addColumnIfNotExists('Users', 'role', {
      type: Sequelize.ENUM('ADMIN', 'OWNER', 'CUSTOMER', 'BROKER'),
      allowNull: false,
      defaultValue: 'CUSTOMER'
    });

    await addColumnIfNotExists('Users', 'isVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await addColumnIfNotExists('Users', 'documents', {
      type: Sequelize.JSON,
      allowNull: true
    });

    await addColumnIfNotExists('Users', 'profileData', {
      type: Sequelize.JSON,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove columns from Properties table
      await queryInterface.removeColumn('Properties', 'propertyType');
      await queryInterface.removeColumn('Properties', 'amenities');
      await queryInterface.removeColumn('Properties', 'events');
      await queryInterface.removeColumn('Properties', 'mediaUrls');

      // Drop Subscriptions table
      await queryInterface.dropTable('Subscriptions');

      // Remove columns from Bookings table
      await queryInterface.removeColumn('Bookings', 'brokerId');
      await queryInterface.removeColumn('Bookings', 'isHourly');
      await queryInterface.removeColumn('Bookings', 'commission');

      // Remove columns from Users table
      await queryInterface.removeColumn('Users', 'role');
      await queryInterface.removeColumn('Users', 'isVerified');
      await queryInterface.removeColumn('Users', 'documents');
      await queryInterface.removeColumn('Users', 'profileData');
    } catch (error) {
      console.error('Error in migration rollback:', error);
    }
  }
};
