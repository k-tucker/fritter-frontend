import type {HydratedDocument, Types} from 'mongoose';
import type {Quote} from '../quote/model';
import QuoteModel from '../quote/model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore quote freets
 * stored in MongoDB, including adding, finding, updating, and deleting quote freets.
 */
class QuoteCollection {
  /**
   * Add a quote freet to the collection
   *
   * @param {string} authorId - The id of the author of the quote freet
   * @param {string} refId - The id of the freet being referenced
   * @param {string} content - The content of the quote freet
   * @param {boolean} anon - whether or not the original freet is anonymized
   * @return {Promise<HydratedDocument<Quote>>} - The newly created quote freet
   */
  static async addOne(authorId: Types.ObjectId | string, refId: Types.ObjectId | string, content: string, anon: boolean): Promise<HydratedDocument<Quote>> {
    const freet = await FreetCollection.findOne(refId);
    const refContent = freet.content;
    const date = new Date();
    const quote = new QuoteModel({
      authorId,
      refId,
      refContent,
      dateCreated: date,
      content,
      dateModified: date,
      anon
    });
    await UserCollection.addQuote(authorId, quote._id);
    await quote.save(); // Saves quote freet to MongoDB
    return quote;
  }

  /**
   * Find a quote freet by quoteId
   *
   * @param {string} quoteId - The id of the quote freet to find
   * @return {Promise<HydratedDocument<Quote>> | Promise<null> } - The quote freet with the given quoteId, if any
   */
  static async findOne(quoteId: Types.ObjectId | string): Promise<HydratedDocument<Quote>> {
    return QuoteModel.findOne({_id: quoteId});
  }

  /**
   * Get all the quote freets in the database
   *
   * @return {Promise<HydratedDocument<Quote>[]>} - An array of all of the quote freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Quote>>> {
    // Retrieves quote freets and sorts them from most to least recent
    return QuoteModel.find({}).sort({dateModified: -1});
  }

  /**
   * Get all the quote freets by given author
   *
   * @param {string} username - The username of author of the quote freets
   * @return {Promise<HydratedDocument<Quote>[]>} - An array of all of the quote freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Quote>>> {
    const author = await UserCollection.findOneByUsername(username);
    return QuoteModel.find({authorId: author._id});
  }

  /**
   * Get all the quote freets based on a given freet
   *
   * @param {string} freetId - The ID of the referenced freet
   * @return {Promise<HydratedDocument<Quote>[]>} - An array of all of the quote freets
   */
  static async findAllByRef(freetId: string): Promise<Array<HydratedDocument<Quote>>> {
    const freet = await FreetCollection.findOne(freetId);
    return QuoteModel.find({refID: freet._id, anon: false}); // Only non-anonymized quote freets can be found by reference to original freet
  }

  /**
   * Get all the quote freets with a given anon status
   *
   * @param {boolean} anon - true if anonymized, false otherwise
   * @return {Promise<HydratedDocument<Quote>[]>} - An array of all of the quote freets
   */
  static async findAllByAnon(anon: boolean): Promise<Array<HydratedDocument<Quote>>> {
    return QuoteModel.find({anon});
  }

  /**
   * Update a quote freet with the new content
   *
   * @param {string} quoteId - The id of the quote freet to be updated
   * @param {Object} quoteDetails - An object with the quote freet's updated details
   * @return {Promise<HydratedDocument<Quote>>} - The newly updated quote freet
   */
  static async updateOne(quoteId: Types.ObjectId | string, quoteDetails: any): Promise<HydratedDocument<Quote>> {
    const quote = await QuoteModel.findOne({_id: quoteId});

    if (quoteDetails.content) {
      quote.content = quoteDetails.content as string;
    }

    if (quoteDetails.anon) {
      quote.anon = quoteDetails.anon as boolean;
    }

    quote.dateModified = new Date();
    await quote.save();
    return quote;
  }

  /**
   * Delete a quote freet with given quoteId.
   *
   * @param {string} quoteId - The quoteFreetId of quote freet to delete
   * @return {Promise<Boolean>} - true if the quote freet has been deleted, false otherwise
   */
  static async deleteOne(quoteId: Types.ObjectId | string): Promise<boolean> {
    const quoteTBD = await QuoteModel.findOne({_id: quoteId});
    await UserCollection.deleteQuote(quoteTBD.authorId, quoteId);
    const quote = await QuoteModel.deleteOne({_id: quoteId});
    return quote !== null;
  }

  /**
   * Delete all the quote freets by the given author
   *
   * @param {string} authorId - The id of author of quote freets
   */
  static async deleteManyAuthor(authorId: Types.ObjectId | string): Promise<void> {
    await QuoteModel.deleteMany({authorId});
    await UserCollection.deleteManyQuote(authorId);
  }

  /**
   * Delete all the quote freets about a given freet
   *
   * @param {string} freetId - The id of freet being referenced
   */
  static async deleteManyRef(freetId: Types.ObjectId | string): Promise<void> {
    await QuoteModel.deleteMany({refId: freetId});
    // Potential issue: delete from appropriate users.
    // Might delete this function in general because I can't think of a use case
  }
}

// ADD: updateManyDeletedFreet? changes the refContent to 'This freet has been deleted.'
// on all anon=false quote freets of said deleted freet

export default QuoteCollection;
