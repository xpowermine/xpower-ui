import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import path from 'path';

// ensure environment vars
import dotenv from 'dotenv';
dotenv.config();

// import routes
import about from './routes/about';
import error from './routes/error';
import home from './routes/home';
import migrate from './routes/migrate';
import nfts from './routes/nfts';
import ppts from './routes/ppts';
import ipfs from './routes/ipfs';
import robots from './routes/robots';
import staking from './routes/staking';

// register view engine for pigs
import { Pig } from './source/engines';
export const app = express();
Pig.register(app);

// setup view engine(s)
app.set('views', [
  path.join(__dirname, 'public', 'views'),
  path.join(__dirname, 'views'),
]);

app.set('view engine', 'pug');
app.set('view engine', 'pig');

// register middleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// register views
app.use('/', home);
app.use('/about', about);
app.use('/migrate', migrate);
app.use('/nfts', nfts);
app.use('/ppts', ppts);
app.use('/staking', staking);
app.use('/robots.txt', robots);
app.use('/ipfs/*', ipfs);
app.use(error);

export default app;
