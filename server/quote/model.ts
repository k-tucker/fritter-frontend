import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type { User } from '../user/model';
import type { Freet } from '../freet/model';

/**
 * This file defines the properties stored in a Quote Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Quote Freet on the backend
export type Quote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  refAuthor: Types.ObjectId;
  refId: Types.ObjectId; // ID of Freet being Quote Freeted
  refContent: string;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  anon: boolean;
};

export type PopulatedQuote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  refAuthor: User;
  refId: string;
  refContent: string;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  anon: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Quote Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const QuoteSchema = new Schema<Quote>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The ID of the freet this quote freet is referencing
  refId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The ID of the freet this quote freet is referencing
  refAuthor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Capture the content as it is when quoted
  refContent: {
    type: String,
    required: true
  },
  // The date the quote freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the quote freet
  content: {
    type: String,
    required: true
  },
  // The date the quote freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  // Whether or not original freet is anonymized
  anon: {
    type: Boolean,
    required: true
  }
});

const QuoteModel = model<Quote>('Quote', QuoteSchema);
export default QuoteModel;
