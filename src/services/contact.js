import Contact from '../models/contactModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import{ SORT_ORDER} from '../constants/contacts.js';


export const fetchAllContacts = async ({ page, perPage, sortOrder = SORT_ORDER.ASC, sortBy = 'name', filters}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = Contact.find();
    if(filters.type){
        contactsQuery.where('contactType').equals(filters.type);
    }
    if(typeof filters.isFavourite === 'boolean'){
        contactsQuery.where('isFavourite').equals(filters.isFavourite);
    }
  const [contacts, contactsCount] = await Promise.all([
    contactsQuery.clone().skip(skip).limit(limit).sort({ [sortBy]: sortOrder }),
    contactsQuery.clone().countDocuments(),
  ]);
    const paginationData = calculatePaginationData(contactsCount, perPage, page);
    return {
        data: contacts,
        ...paginationData,
    };
};
   
export const fetchContactById = async (contactId) => {
    return await Contact.findById(contactId);
};
export const createContact = async (payload) => {
    const contact = await Contact.create(payload);
    return contact;
};
export const updateContact = async (contactId, payload) => {
    const contact = await Contact.findOneAndUpdate({ _id: contactId }, payload, {new: true} );
    return contact ? {contact} : null;  
};
export const deleteContact = async (contactId) => {
    const contact = await Contact.findOneAndDelete({_id: contactId,});
    return contact;
};