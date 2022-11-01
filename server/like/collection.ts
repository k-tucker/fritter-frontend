import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from '../like/model';

/**
 * This file contains a class with functionality to interact with Likes stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 */
class LikeCollection {
  /**
   * Add a new Like
   *
   * @param {string} userId - The userId of the account making this like
   * @param {string} postId - The ID of the post being liked
   * @param {string} postType - Whether post is a freet or a quote freet
   * @return {Promise<HydratedDocument<Like>>} - The newly created Like
   */
  static async addOne(userId: string, postId: string, postType: string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      liker: userId,
      liked: postId,
      postType
    });
    await like.save(); // Saves like to MongoDB
    return like;
  }

  /**
   * Find a Like by likeId.
   *
   * @param {string} likeId - The likeId of the Like to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null>}
   */
  static async findOneByLikeId(likeId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({_id: likeId});
  }

  /**
   * Find a Like by likeId.
   *
   * @param {string} postId - The ID of the liked post
   * @param {string} postType - whether the post is a Freet or Quote
   * @param {string} userId - user who made the like
   * @return {Promise<HydratedDocument<Like>> | Promise<null>}
   */
  static async findOneByLikedPost(postId: Types.ObjectId | string, postType: string, userId: string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({liked: postId, postType, liker: userId});
  }

  /**
   * Delete a Like from the collection.
   *
   * @param {string} likeId - The likeId of Like to delete
   * @return {Promise<Boolean>} - true if the Like has been deleted, false otherwise
   */
  static async deleteOne(likeId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({_id: likeId});
    return like !== null;
  }
}

export default LikeCollection;
