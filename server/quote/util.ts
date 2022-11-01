import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Quote} from './model';

// Update this if you add a property to the Freet type!
type QuoteResponse = {
  _id: string;
  refId: string;
  authorId: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  anon: boolean;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Quote>} quote - A freet
 * @returns {QuoteResponse} - The freet object formatted for the frontend
 */
const constructQuoteResponse = (quote: HydratedDocument<Quote>): QuoteResponse => {
  const quoteCopy: Quote = {
    ...quote.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...quoteCopy,
    _id: quoteCopy._id.toString(),
    refId: quoteCopy.refId.toString(),
    authorId: quoteCopy.authorId.toString(),
    dateCreated: formatDate(quote.dateCreated),
    dateModified: formatDate(quote.dateModified),
    anon: quoteCopy.anon
  };
};

export {
  constructQuoteResponse
};
