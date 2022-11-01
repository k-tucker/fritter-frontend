import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

// export type postTypes = 'Freet' | 'Quote';

// Type definition for Like on the backend
export type Like = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  liker: string;
  liked: string;
  postType: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema({
  // The user doing the like
  liker: {
    type: String,
    required: true
  },
  // The ID of the item being liked
  liked: {
    type: String,
    required: true
  },
  postType: {
    type: String,
    required: true
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
