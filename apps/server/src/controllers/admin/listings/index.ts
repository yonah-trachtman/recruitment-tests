import assetModel from '../../../services/mongo/assets/assetModel';
import {
  Status,
  MissingInputError,
  ResourceNotFoundError,
} from '@offisito-shared';
import { findDocs, validateExisting } from '../../';

const validateIdInput = (id: string) => {
  if (!validateExisting(id)) {
    throw new MissingInputError('listing', 'id');
  }
  return true;
};

const validateResourceFound = (resource: any) => {
  if (!resource) {
    throw new ResourceNotFoundError('listing');
  }
  return true;
};

export const getAllAssets = async (lean = true) =>
  findDocs(assetModel().find(), lean);

export const findAssetsByPublishingStatus = async (
  assetStatus: Status,
  lean = true,
) => findDocs(assetModel().find({ publishingStatus: assetStatus }), lean);

export const updateAssetStatus = async (id: string, newStatus: Status) => {
  const asset = await getAsset(id);
  asset.publishingStatus = newStatus;
  await asset.save();
  return asset;
};

const getAsset = async (id: string, lean = true) => {
  validateIdInput(id);
  const asset = await findDocs(assetModel().findById(id), lean);
  validateResourceFound(asset);
  return asset;
};
