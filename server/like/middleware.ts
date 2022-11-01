import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import QuoteCollection from '../quote/collection';
import LikeCollection from './collection';

/**
 * Checks if the user is signed out, that is, userId is undefined in session
 */
const isUserLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    res.status(403).json({
      error: 'You are already signed in.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as author id in req.query exists
 */
const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.author) {
    res.status(400).json({
      error: 'Provided author username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByUsername(req.query.author as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.query.author as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a freet or quote freet with postId is req.params exists
 */
const isValidPost = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.postid);
  let post;
  if (req.params.posttype === 'Quote') {
    post = validFormat ? await QuoteCollection.findOne(req.params.postid) : '';
  } else if (req.params.posttype === 'Freet') {
    post = validFormat ? await FreetCollection.findOne(req.params.postid) : '';
  } else {
    res.status(400).json({
      error: {
        invalidPostType: `Post type ${req.params.posttype} does not exist.`
      }
    });
  }

  if (!post) {
    res.status(404).json({
      error: `Freet with freet ID ${req.params.postid} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the user has already liked a post
 */
const isPostLiked = async (req: Request, res: Response, next: NextFunction) => {
  const liker = req.session.userId as string;
  const like = await LikeCollection.findOneByLikedPost(req.params.postid, req.params.posttype, liker);
  if (!like) {
    res.status(403).json({
      error: 'You have not liked this post yet.'
    });
    return;
  }

  next();
};

/**
 * Checks that user hasn't already liked a post
 */
const isPostUnliked = async (req: Request, res: Response, next: NextFunction) => {
  const liker = req.session.userId as string;
  const like = await LikeCollection.findOneByLikedPost(req.params.postid, req.params.posttype, liker);
  if (like) {
    res.status(403).json({
      error: 'You are have already liked this post.'
    });
    return;
  }

  next();
};

export {
  isUserLoggedOut,
  isAuthorExists,
  isValidPost,
  isPostLiked,
  isPostUnliked
};
