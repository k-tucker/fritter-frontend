import type {Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import FritFormCollection from './collection';

const router = express.Router();

/**
 * Create a fritform linked to a user account.
 *
 * @name POST /api/fritforms
 *
 * @param {string} fields - fields separated by commas
 * @return {FritFormResponse} - The created fritform object
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId((req.session.userId as string));
    const fieldsArray: string[] = (req.body.fields as string).split(',');
    const fritform = await FritFormCollection.addOne(user._id.toString(), fieldsArray);
    res.status(201).json({
      message: 'Your FritForm was created successfully.',
      fritform: util.constructFritFormResponse(fritform)
    });
  }
);

/**
 * Update a fritform's fields.
 *
 * @name PUT /api/fritforms
 *
 * @param {string} fields new fields (separated by commas)
 * @return {FritFormResponse} - The updated fritform
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const fritform = await FritFormCollection.findOneByUserId(userId);
    const newFritform = await FritFormCollection.updateOne(fritform._id, req.body);
    res.status(200).json({
      message: 'Your fritform was updated successfully.',
      fritform: util.constructFritFormResponse(newFritform)
    });
  }
);

/**
   * Delete a fritform.
   *
   * @name DELETE /api/fritforms
   *
   * @return {string} - A success message
   * @throws {403} - If the user is not logged in
   */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
    // ADD: does user have a fritform set up?
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const fritform = await FritFormCollection.findOneByUserId(userId);
    await FritFormCollection.deleteOne(fritform._id);
    res.status(200).json({
      message: 'Your fritform has been deleted successfully.'
    });
  }
);

export {router as fritformRouter};
