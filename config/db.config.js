require('dotenv').config();

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

module.exports = {
  development: {
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    dialect: 'postgres',
    pool: {
      max: 5, // max num of connection in pool
      min: 0, // minnum of connection in pool
      acquire: 30000, // max time pool will try to get connection before throwing an error
      idle: 10000 // max time a connection can be idle before being released
    }
  },
  // test: {
  //   host: DB_HOST,
  //   username: DB_USER,
  //   password: DB_PASSWORD,
  //   database: DB_NAME,
  //   dialect: 'postgres',
  //   pool: {
  //     max: 5, // max num of connection in pool
  //     min: 0, // minnum of connection in pool
  //     acquire: 30000, // max time pool will try to get connection before throwing an error
  //     idle: 10000 // max time a connection can be idle before being released
  //   }
  // },
  production: {
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    dialect: 'postgres',
    pool: {
      max: 5, // max num of connection in pool
      min: 0, // minnum of connection in pool
      acquire: 30000, // max time pool will try to get connection before throwing an error
      idle: 10000 // max time a connection can be idle before being released
    }
  },
};