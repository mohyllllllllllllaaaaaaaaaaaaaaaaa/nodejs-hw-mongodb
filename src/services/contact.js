import Contact from "../models/contactModel.js";

export const fetchAllContacts = async () => {
    console.log('im work');
    return await Contact.find();
};
export const fetchContactById = async (contactId) => {
      console.log('fetchContactById шукає контакт з id:');
    return await Contact.findById(contactId);
};