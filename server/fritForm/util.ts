import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {FritForm} from './model';

// Update this if you add a property to the User type!
type FritFormResponse = {
  _id: string;
  userId: string;
  fields: string[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<FritForm>} fritform - A user object
 * @returns {FritFormResponse} - The user object without the password
 */
const constructFritFormResponse = (fritform: HydratedDocument<FritForm>): FritFormResponse => {
  const fritformCopy: FritForm = {
    ...fritform.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...fritformCopy,
    _id: fritformCopy._id.toString(),
    userId: fritformCopy.userId,
    fields: fritformCopy.fields
  };
};

export {
  constructFritFormResponse
};
