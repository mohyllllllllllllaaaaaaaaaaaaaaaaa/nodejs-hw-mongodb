import  mongoose from 'mongoose';
import { createContact, deleteContact, updateContact } from '../services/contact.js';
import createHttpError from 'http-errors';
import Contact from '../models/contactModel.js';


export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const contact = await Contact.findById(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};
export const addContact = async(req, res, next) => {
  try{
const contact = await createContact(req.body);
res.status(201).json({
  status: 201,
  message: "Successfully created a contact!",
  data: contact,
});
}catch(error){
  next(error);
}
};
export const updateContactController = async (req, res, next) => {
  try{
  const{ contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if(!result){
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
  
}catch(error){
    next(error);
  }
};
export const deleteContactController = async(req, res, next) => {
  try{
const {contactId} = req.params;
const contact = await deleteContact(contactId);
if(!contact){
  next(createHttpError(404, "Contact not found"));
  return;
}
res.status(204).send();
}catch(error){
  next(error);
}
};