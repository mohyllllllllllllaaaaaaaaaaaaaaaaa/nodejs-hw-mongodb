import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import router from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';

export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use('/contacts', router); 

  
  app.use(notFoundHandler);
 app.use(errorHandler);
 
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
