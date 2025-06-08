import express from 'express';
import { getAllContacts, getContactById } from '../controllers/contactsController.js';

const contactsRouter = express.Router();
contactsRouter.get('/', getAllContacts);
contactsRouter.get('/:contactId', getContactById);

export default contactsRouter;