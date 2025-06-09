import { fetchAllContacts, fetchContactById } from "../services/contact.js";
import mongoose from "mongoose";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await fetchAllContacts();
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
    console.log('Requested contactId:', contactId);

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
console.log(mongoose.Types.ObjectId.isValid('6846f5125664987782fd7cf8')); 
    const contact = await fetchContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Not found contact' });
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