/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const apiRouter = require( './routes/apiV1' );
const hcRouter = require( './routes/healthcheck' );
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const fs = require('fs');



const app = express();


const mongooseConfigs = { 
  dbName: 'badbank',
  useNewUrlParser: true, 
  useUnifiedTopology: true
};
mongoose.connect(process.env.MONGO_URI, mongooseConfigs)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error)); 

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', express.static('public'));
app.use('/api/v1', apiRouter);
app.use('/healthcheck', hcRouter);

module.exports = app;
