import type {HydratedDocument, Types} from 'mongoose';
import type {FritForm} from './model';
import FritFormModel from './model';
import UserCollection from '../user/collection';

/**
 * This file contains a class with functionality to interact with FritForms stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<FritForm> is the output of the FritFormModel() constructor,
 * and contains all the information in FritForm. https://mongoosejs.com/docs/typescript.html
 */
class FritFormCollection {
  /**
   * Add a new FritForm
   *
   * @param {string} userId - The userId of the account creating this FritForm
   * @param {Array<string>} fields - The fields associated with this FritForm
   * @return {Promise<HydratedDocument<FritForm>>} - The newly created FritForm
   */
  static async addOne(userId: string, fields: string[]): Promise<HydratedDocument<FritForm>> {
    const user = await UserCollection.findOneByUserId(userId);
    const fritForm = new FritFormModel({userId: user._id.toString(), fields});
    await fritForm.save(); // Saves user to MongoDB
    return fritForm;
  }

  /**
   * Find a FritForm by formId.
   *
   * @param {string} formId - The formId of the FritForm to find
   * @return {Promise<HydratedDocument<FritForm>> | Promise<null>}
   */
  static async findOneByFormId(formId: Types.ObjectId | string): Promise<HydratedDocument<FritForm>> {
    return FritFormModel.findOne({_id: formId});
  }

  /**
   * Find a FritForm by userId of the user who created it.
   *
   * @param {string} userId - The userId of the user who created the FritForm to find
   * @return {Promise<HydratedDocument<FritForm>> | Promise<null>}
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<FritForm>> {
    return FritFormModel.findOne({userId});
  }

  /**
   * Update FritForm's information
   *
   * @param {string} formId - The formId of the FritForm to update
   * @param {Object} formDetails - An object with the FritForm's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated FritForm
   */
  static async updateOne(formId: Types.ObjectId | string, formDetails: any): Promise<HydratedDocument<FritForm>> {
    const fritForm = await FritFormModel.findOne({_id: formId});

    if (formDetails.fields) {
      fritForm.fields = (formDetails.fields as string).split(',');
    }

    await fritForm.save();
    return fritForm;
  }

  /**
   * Delete a FritForm from the collection.
   *
   * @param {string} formId - The formId of FritForm to delete
   * @return {Promise<Boolean>} - true if the FritForm has been deleted, false otherwise
   */
  static async deleteOne(formId: Types.ObjectId | string): Promise<boolean> {
    const fritForm = await FritFormModel.deleteOne({_id: formId});
    return fritForm !== null;
  }
}

export default FritFormCollection;
