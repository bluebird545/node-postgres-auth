const express = require('express'); // import express from 'express'; // ES module
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes'); // import routes from './routes';
const db = require('./utils/database');
const ApiError = require('./utils/errors');

const app = express();

var corsOptions = {
  origin: ['https://localhost:5173'],
  credentials: true
}

/**
 * middlewares
 */
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ 
//    extended: true 
// }));

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// cookie 
app.use(cookieParser());

// initializing database
// Database.initDB();

// establish database connection
db.connectDB();

// api routes
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  // next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  next(new ApiError(404, 'Not found'));
  // next(new ApiError());
});

// set port 
const PORT = process.env.PORT || 8080

// listen for requests
app.listen(PORT, () => {
  console.log(`Magic is happening on port ${PORT}`)
})