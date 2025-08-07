const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  type: {
    type: DataTypes.ENUM('gratis', 'vip'),
    defaultValue: 'gratis',
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

const Team = sequelize.define('Team', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  click_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('aktif', 'penuh'),
    defaultValue: 'aktif',
  },
});

const Order = sequelize.define('Order', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  paket: {
    type: DataTypes.ENUM('bulanan', 'tahunan'),
    allowNull: false,
  },
  bukti_url: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
});

const Setting = sequelize.define('Setting', {
  qris_url: DataTypes.STRING,
  rekening: DataTypes.STRING,
  admin_contact: DataTypes.STRING,
});

const Admin = sequelize.define('Admin', {
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { sequelize, User, Team, Order, Setting, Admin };