const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_DIALECT === 'sqlite' || process.env.REPL_ID) {
  // Replit or explicit sqlite mode
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || '/tmp/db.sqlite',
    logging: false,
  });
  console.log('Using SQLite database');
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  });
  console.log('Using MySQL database');
}

module.exports = { sequelize };