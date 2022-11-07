import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import QuoteCollection from './collection';

/**
 * Checks if a quote freet with quoteFreetId req.params.quoteId exists
 */
const isQuoteExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.quoteId);
  const quote = validFormat ? await QuoteCollection.findOne(req.params.quoteId) : '';
  if (!quote) {
    res.status(404).json({
      error: `Quote freet with ID ${req.params.quoteId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the quote freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidQuoteContent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.content) {
    next();
    return;
  }

  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Quote freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Quote freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the quote freet whose quoteFreetId is in req.params
 */
const isValidQuoteModifier = async (req: Request, res: Response, next: NextFunction) => {
  const quote = await QuoteCollection.findOne(req.params.quoteId);
  const userId = quote.authorId._id;
  if (req.session.userId.toString() !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' quote freets.'
    });
    return;
  }

  next();
};

export {
  isValidQuoteContent,
  isQuoteExists,
  isValidQuoteModifier
};
