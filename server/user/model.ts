/* eslint-disable capitalized-comments */
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  following: string[];
  freets: string[];
  quotes: string[];
  highlights: string[];
  // highlights: Set<Types.ObjectId>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  },
  // All Users followed by this User
  following: {
    type: Array,
    required: true
  },
  // All IDs of Freets this User has authored
  freets: {
    type: Array,
    required: true
  },
  // All IDs of Quote Freets this User has authored
  quotes: {
    type: Array,
    required: true
  },
  // All IDs of posts this User has highlighted (denotes what tyoe of post)
  highlights: {
    type: Array,
    required: true
  }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
