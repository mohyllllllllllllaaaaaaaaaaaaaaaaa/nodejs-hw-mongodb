import express from 'express';
import { getAllContacts, getContactById } from '../controllers/contactsController.js';
console.log('Contacts router loaded'); 
const router = express.Router();
router.get('/', getAllContacts);
router.get('/:contactId', getContactById);


export default router;
