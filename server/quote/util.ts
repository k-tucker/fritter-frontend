import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Quote, PopulatedQuote} from './model';

// Update this if you add a property to the Freet type!
type QuoteResponse = {
  _id: string;
  refAuthor: string;
  refContent: string;
  author: string;
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
  const quoteCopy: PopulatedQuote = {
    ...quote.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = quoteCopy.authorId;
  delete quoteCopy.authorId;
  const refAuthor = quoteCopy.refAuthor.username;
  delete quoteCopy.refAuthor;
  return {
    ...quoteCopy,
    _id: quoteCopy._id.toString(),
    refAuthor: refAuthor,
    refContent: quoteCopy.refContent,
    author: username,
    dateCreated: formatDate(quote.dateCreated),
    dateModified: formatDate(quote.dateModified),
    anon: quoteCopy.anon
  };
};

export {
  constructQuoteResponse
};
