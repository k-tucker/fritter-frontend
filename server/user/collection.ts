/* eslint-disable capitalized-comments */
import type {HydratedDocument, ObjectId, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';
import FreetCollection from '../freet/collection';
import type {Freet} from '../freet/model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, password: string): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();
    const following: string[] = [];
    const freets: string[] = [];
    const quotes: string[] = [];
    const highlights: string[] = [];

    const user = new UserModel({username, password, dateJoined, following, freets, quotes, highlights});
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    if (username) {
      return UserModel.findOne({username: new RegExp(`^${username.trim()}$`, 'i')});
    }

    return undefined;
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.password) {
      user.password = userDetails.password as string;
    }

    if (userDetails.username) {
      user.username = userDetails.username as string;
    }

    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }

  /**
   * Find all highlighted freets by user with userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<Freet>[]> | Promise<null>} - The user with the given username, if any
   */
  static async findHighlights(userId: string): Promise<Array<HydratedDocument<Freet>>> {
    const user = await (await UserCollection.findOneByUsername(userId)).populate('highlights');
    // console.log(user.highlights);
    const {highlights} = await (await UserCollection.findOneByUserId(user._id)).populate('highlights');
    // console.log(...user.highlights);
    const highlightStrings = new Set<string>();
    for (const highlight of highlights) {
      highlightStrings.add(highlight.toString());
    }

    // console.log(...highlightStrings);
    const freets = await FreetCollection.findAllByUsername(user.username);
    const result = [];
    // console.log(freets);
    for (const freet of freets) {
      // console.log(freet._id.toString());
      if (highlightStrings.has(freet._id.toString())) {
        result.push(freet);
      }
    }

    return result;
  }

  /**
   * Add a post to user's highlights
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} freetId - ID of a freet to be added to highlights list
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async createHighlight(userId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId}).populate('highlights');
    const highlightsCopy = new Set<string>(user.highlights);
    highlightsCopy.add((freetId.toString()));
    user.highlights = Array.from(highlightsCopy);
    // user.highlights = highlightsCopy;
    // console.log(highlightsCopy);
    user.markModified('highlights');
    await user.save();
    // console.log('highlights', user.highlights);
    return user;
  }

  /**
   * Add a post to user's highlights
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} freetId - ID of a freet to be added to highlights list
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async deleteHighlight(userId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId}).populate('highlights');
    const highlightsCopy = new Set(user.highlights);
    // console.log(highlightsCopy);
    // console.log('freetId string:', freetId.toString());
    highlightsCopy.delete((freetId.toString()));
    // console.log(freetId);
    // console.log(highlightsCopy);
    user.highlights = Array.from(highlightsCopy);
    // user.highlights = highlightsCopy;
    user.markModified('highlights');
    await user.save();
    return user;
  }

  /**
   * Update user's freet information (add new freet)
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} freetId - the ID of a freet to be associated with this user
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async addFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const userFreets = new Set(user.freets);
    userFreets.add(freetId.toString());
    user.freets = Array.from(userFreets);

    user.markModified('freets');
    await user.save();
    return user;
  }

  /**
   * Update user's quote information (add new quote)
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} quoteId - the ID of a quote to be associated with this user
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async addQuote(userId: Types.ObjectId | string, quoteId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const userQuotes = new Set(user.quotes);
    userQuotes.add(quoteId.toString());
    user.quotes = Array.from(userQuotes);

    user.markModified('quotes');
    await user.save();
    return user;
  }

  /**
   * Update user's freet information (delete freet)
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} freetId - the ID of a freet to be unassociated with this user
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async deleteFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const userFreets = new Set(user.freets);
    userFreets.delete(freetId.toString());
    user.freets = Array.from(userFreets);

    user.markModified('freets');
    await user.save();
    return user;
  }

  /**
   * Update user's quote information (delete quote)
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} quoteId - the ID of a quote to be unassociated with this user
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async deleteQuote(userId: Types.ObjectId | string, quoteId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const userQuotes = new Set(user.quotes);
    userQuotes.delete((quoteId.toString()));
    user.quotes = Array.from(userQuotes);

    user.markModified('quotes');
    await user.save();
    return user;
  }

  /**
   * Update user's quote information (delete all freets)
   *
   * @param {string} userId - The userId of the user to update
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async deleteManyFreet(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (user) {
      user.freets = [];
      user.markModified('freets');
      await user.save();
    }

    return user;
  }

  /**
   * Update user's quote information (delete all quotes)
   *
   * @param {string} userId - The userId of the user to update
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async deleteManyQuote(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (user) {
      user.quotes = [];
      user.markModified('quotes');
      await user.save();
    }

    return user;
  }

  /**
   * Update user's freet information (add new followed account)
   *
   * @param {string} userId - The userId of the user to update
   * @param {string} toFollowId - the ID of a user to be followed
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async addFollow(userId: Types.ObjectId | string, toFollowId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const followingCopy = new Set(user.following);
    followingCopy.add((toFollowId.toString()));
    user.following = Array.from(followingCopy);

    user.markModified('following');
    await user.save();
    return user;
  }

  /**
   * Update user's freet information (add new followed account)
   *
   * @param {string} userId - The userId of the user to update
   * @param {string} toFollowId - the ID of a user to be followed
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async deleteFollow(userId: Types.ObjectId | string, toFollowId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const followingCopy = new Set(user.following);
    followingCopy.delete((toFollowId.toString()));
    user.following = Array.from(followingCopy);

    user.markModified('following');
    await user.save();
    return user;
  }
}

export default UserCollection;
