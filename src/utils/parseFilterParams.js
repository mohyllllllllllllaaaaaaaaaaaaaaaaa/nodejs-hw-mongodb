import { CONTACT_TYPE } from "../constants/contacts.js";

const parseType = (value) => {
   if(Object.values( CONTACT_TYPE ).includes(value)) return value;
};
const parseIsFavourite = (value) => {
   if(['true', 'false'].includes(value)) return JSON.parse(value);
};

export const parseFilterParams = (obj) => {
    return{
    type: parseType(obj.type),
    isFavourite: parseIsFavourite(obj.isFavourite),
    }
};