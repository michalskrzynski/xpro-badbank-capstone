/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import mongoose from 'mongoose';
import * as routes from './routes';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();

// database setup
const mongoUri = process.env.MONGODB_URI || `mongodb+srv://xpro-user:${process.env.MONGO_PASSWORD}@cluster0.zezgzyy.mongodb.net/?retryWrites=true&w=majority`;
const mongooseConfigs = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(mongoUri, mongooseConfigs)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB Atlas:', error)); 

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/api/v1', routes.apiV1);
app.use('/api/users', routes.users);

module.exports = app;
