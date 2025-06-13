import Contact from '../models/contactModel.js';

export const fetchAllContacts = async () => {
    return await Contact.find();
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