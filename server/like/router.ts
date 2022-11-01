import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import LikeCollection from './collection';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';

const router = express.Router();

/**
 * Create a new like.
 *
 * @name POST /api/likes/:postid&:posttype
 *
 * @param {string} postid - The post being liked
 * @param {string} posttype - The type of post being liked
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {400} - if post type is not 'Freet' or 'Quote'
 */
router.post(
  '/:postid&:posttype?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isValidPost,
    likeValidator.isPostUnliked
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await LikeCollection.addOne(userId, req.params.postid, req.params.posttype);

    res.status(201).json({
      message: 'Your like was created successfully.',
      like: util.constructLikeResponse(like)
    });
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/likes/:postid&:posttype
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:postid&:posttype?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isValidPost,
    likeValidator.isPostLiked
  ],
  async (req: Request, res: Response) => {
    const like = await LikeCollection.findOneByLikedPost(req.params.postid, req.params.posttype, (req.session.userId as string));
    await LikeCollection.deleteOne(like._id);
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);

export {router as likeRouter};
