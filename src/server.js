import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRouter from './routers/contactsRouter.js';

export function setupServer() {
  const app = express();
   const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json());
  app.use('/api/contacts', contactsRouter);
   app.use( (req, res) => {
  res.status(404).json({ message: 'Not found' });
});
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
 
};