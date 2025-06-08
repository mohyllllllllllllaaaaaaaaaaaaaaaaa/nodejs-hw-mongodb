import { fetchAllContacts, fetchContactById } from "../services/contact.js";

export const getAllContacts = async (req, res, next) => {
    try{
        const contacts = await fetchAllContacts();
        res.status(200).json({
         status: 200,
         message: "Successfully found contacts!",
         data: contacts,
        });
    }catch(error){
        next(error);
    }
};
export const getContactById = async (req, res, next) => {
      console.log('ContactId from params:', req.params.contactId);
    try{
        const{contactId} = req.params;
        const contact = await fetchContactById(contactId);
        if(!contact){
            return res.status(404).json({message: 'Contact not found'});
        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    }catch(error){
        next(error);
    }
};