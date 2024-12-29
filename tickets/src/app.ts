import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {  NotFoundError } from './errors/not-found-error';
import {errorHandler} from './middlewares/error-handler'
import {createTicketRouter} from './routes/new'
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';

console.log('I am looking into tickets now')
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});
// @ts-ignore
app.use(errorHandler);

export { app };
