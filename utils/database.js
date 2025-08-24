const db = require('../db');

/**
 * initializes database
 */
async function initDB() {
  console.log(`initializing database`)
  // if (await connectDB()) {
  //   console.log(`connectd@`)
  // }
  // db.sequelize.sync({ force: true }).then(() => {
  //   console.log('Database & tables created!');
  // });
}

/**
 * establish connection to database
 */
async function connectDB() {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully!');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
}

module.exports = { initDB, connectDB }