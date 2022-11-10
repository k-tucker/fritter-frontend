/* eslint-disable capitalized-comments */
import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import * as freetUtil from '../freet/util';
import mongoose from 'mongoose';
import QuoteCollection from '../quote/collection';

const router = express.Router();

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isValidPassword,
    userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsernameAndPassword(
      req.body.username, req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/*
  * Get the signed in user
  * TODO: may need better route and documentation
  * (so students don't accidentally delete this when copying over)
  *
  * @name GET /api/users/session
  *
  * @return - currently logged in user, or null if not logged in
  */
 router.get(
   '/session',
   [],
   async (req: Request, res: Response) => {
     const user = await UserCollection.findOneByUserId(req.session.userId);
     res.status(200).json({
       message: 'Your session info was found successfully.',
       user: user ? util.constructUserResponse(user) : null
     });
   }
 );

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.username, req.body.password);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PATCH /api/users
 *
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.patch(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await UserCollection.deleteOne(userId);
    await FreetCollection.deleteMany(userId);
    await QuoteCollection.deleteManyAuthor(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

/**
 * Get highlights by author.
 *
 * @name GET /api/highlights?author=username
 *
 * @return {FreetResponse[]} - An array of highlights created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/highlights',
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorHighlights = await UserCollection.findHighlights(req.query.author as string);
    const response = authorHighlights.map(freetUtil.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create highlight.
 *
 * @name POST /api/highlights
 *
 * @return {UserResponse[]} - The created highlight
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.post(
  '/highlights/:freetId?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const freetId = new mongoose.Types.ObjectId(req.params.freetId);
    await UserCollection.createHighlight(user._id, freetId);
    const response = util.constructUserResponse(user);
    res.status(200).json(response);
  }
);

/**
 * Delete a highlight.
 *
 * @name DELETE /api/highlights
 *
 * @return {UserResponse[]} - An array of highlights created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.delete(
  '/highlights/:freetId?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const freetId = new mongoose.Types.ObjectId(req.params.freetId);
    await UserCollection.deleteHighlight(user._id, freetId);
    const response = util.constructUserResponse(user);
    res.status(200).json(response);
  }
);

/**
 * Create follow.
 *
 * @name POST /api/follow/username
 *
 * @return {UserResponse[]} - The User with updated following list
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.post(
  '/follow/:username?',
  [
    userValidator.isUserLoggedIn
    // ADD: is username an existing account?
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const toFollow = await UserCollection.findOneByUsername(req.params.username);
    await UserCollection.addFollow(user._id, toFollow._id);
    const response = util.constructUserResponse(user);
    res.status(200).json(response);
  }
);

/**
 * Delete a follow.
 *
 * @name DELETE /api/users/follow/:username
 *
 * @return {UserResponse[]} - An array of highlights created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.delete(
  '/follow/:username?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const toFollow = await UserCollection.findOneByUsername(req.params.username);
    await UserCollection.deleteFollow(user._id, toFollow._id);
    const response = util.constructUserResponse(user);
    res.status(200).json(response);
  }
);

/**
 * Get number of people this user is following.
 *
 * @name GET /api/users/follow
 *
 * @return {UserResponse[]} - An array of highlights created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
 router.get(
  '/follow',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const response = util.constructUserResponse(user);
    res.status(200).json(response);
  }
);

export {router as userRouter};
