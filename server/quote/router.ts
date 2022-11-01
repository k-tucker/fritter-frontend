import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import QuoteCollection from './collection';
import * as userValidator from '../user/middleware';
import * as quoteValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the quote freets
 *
 * @name GET /api/quotes
 *
 * @return {QuoteResponse[]} - A list of all the quote freets sorted in descending
 *                      order by date modified
 */
/**
 * Get quote freets by author.
 *
 * @name GET /api/quotes?authorId=id
 *
 * @return {QuoteResponse[]} - An array of quote freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allQuote = await QuoteCollection.findAll();
    const response = allQuote.map(util.constructQuoteResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorQuotes = await QuoteCollection.findAllByUsername(req.query.author as string);
    const response = authorQuotes.map(util.constructQuoteResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new quote freet.
 *
 * @name POST /api/quotes
 *
 * @param {string} content - The content of the quote freet
 * @param {string} refId - ID of the original freet
 * @param {string} anon - whether or not to anonymize
 * @return {QuoteResponse} - The created quote freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    quoteValidator.isValidQuoteContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const quote = await QuoteCollection.addOne(userId, req.body.refId as string, req.body.content as string, req.body.anon as boolean);

    res.status(201).json({
      message: 'Your freet was created successfully.',
      quote: util.constructQuoteResponse(quote)
    });
  }
);

/**
 * Delete a quote
 *
 * @name DELETE /api/quotes/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:quoteId?',
  [
    userValidator.isUserLoggedIn,
    quoteValidator.isQuoteExists,
    quoteValidator.isValidQuoteModifier
  ],
  async (req: Request, res: Response) => {
    await QuoteCollection.deleteOne(req.params.quoteId);
    res.status(200).json({
      message: 'Your quote was deleted successfully.'
    });
  }
);

/**
 * Modify a quote
 *
 * @name PUT /api/quotes/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  '/:quoteId?',
  [
    userValidator.isUserLoggedIn,
    quoteValidator.isQuoteExists,
    quoteValidator.isValidQuoteModifier,
    quoteValidator.isValidQuoteContent
  ],
  async (req: Request, res: Response) => {
    const quote = await QuoteCollection.updateOne(req.params.quoteId, req.body);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      quote: util.constructQuoteResponse(quote)
    });
  }
);

export {router as quoteRouter};
