import { createContact, deleteContact, fetchAllContacts, fetchContactById, updateContact } from '../services/contact.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parsedSortParams} from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/cloudinary.js';

// eslint-disable-next-line no-unused-vars
export const getAllContacts = async (req, res, next) => {
    const { _id: userId } = req.user;
  const {page, perPage} = parsePaginationParams(req.query);
  const {sortBy, sortOrder} = parsedSortParams(req.query); 
  const filters =  parseFilterParams(req.query)
    const contacts = await fetchAllContacts({ page, perPage, sortBy, sortOrder, filters, userId });
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });

};

export const getContactById = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { contactId } = req.params;
    const contact = await fetchContactById(contactId, userId);

    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
 
};
export const addContact = async(req, res) => {
const {_id: userId} = req.user;
const file = req.file;
let photoURL = null;
if(file) {
  const {secure_url} = await saveFileToCloudinary(file.path);
  photoURL = secure_url;
}
const contact = await createContact({
  ...req.body,
   userId,
  photo: photoURL,
  });
res.status(201).json({
  status: 201,
  message: "Successfully created a contact!",
  data: contact,
});

};
export const updateContactController = async (req, res, next) => {
    const { _id: userId } = req.user;
  const{ contactId } = req.params;
   const file = req.file;
   let updatedFile = {...req.body};
   if(file){
     const { secure_url } = await saveFileToCloudinary(file.path);
      updatedFile.photo = secure_url;
   }

  const result = await updateContact(contactId,  updatedFile, userId);
  if(!result){
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
  
};
export const deleteContactController = async(req, res, next) => {
    const { _id: userId } = req.user;
const {contactId} = req.params;
const contact = await deleteContact(contactId, userId);
if(!contact){
  next(createHttpError(404, "Contact not found"));
  return;
}
res.status(204).send();

};