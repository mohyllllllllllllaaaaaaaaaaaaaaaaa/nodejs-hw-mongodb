import { SORT_ORDER } from "../constants/contacts.js";

const validateSortOrder = (sortOrder) => {
    const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
    if(isKnownOrder) {
        return sortOrder;
    }
    return SORT_ORDER.ASC;
};
const validateSortBy = (sortBy) => {
    const keysOfContacts = [
          "_id",
                "name",
                "phoneNumber",
                "email",
                "isFavourite",
                "contactType",
                "createdAt",
                "updatedAt",
    ];
    if(keysOfContacts.includes(sortBy)){
        return sortBy;
    }
    return "_id";
};
export const parsedSortParams = ( query ) => {
    const {sortOrder, sortBy} = query;
    const parsedSortOrder = validateSortOrder(sortOrder);
    const parsedSortBy = validateSortBy(sortBy);
   
return{
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
};
};