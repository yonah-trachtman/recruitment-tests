import { Response } from 'express';
import { AuthenticatedRequest } from '@auth-backend';
import AssetModel from '../../../services/mongo/assets/assetModel';
import CompanyModel from '../../../services/mongo/assets/companyModel';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { preSignFile, s3Client, s3Settings } from '@s3-backend';

export const signUrls = async (arr: string[]): Promise<string[]> => {
  const signedUrls = await Promise.all(
    arr.map(async (key) => {
      const checkKey = 'cropped-' + key;
      try {
        await s3Client.send(
          new HeadObjectCommand({
            Bucket: s3Settings.s3BucketName,
            Key: checkKey,
          }),
        );
        return preSignFile(checkKey);
      } catch (error) {
        if (error.name === 'NotFound') {
          return preSignFile(key);
        } else {
          throw error;
        }
      }
    }),
  );
  return signedUrls;
};

export const getAssetDetail = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const assetModel = AssetModel();

  try {
    const asset_id = req.params.asset_id;

    const findAsset = (await assetModel.findById({ _id: asset_id })).toObject();

    if (!findAsset) return res.status(400).send('Not Valid ASSET ID');

    if (findAsset.photos?.length > 0)
      findAsset.photoURLs = await signUrls(findAsset.photos);

    return res.status(200).json(findAsset);
  } catch (error) {
    next(error);
  }
};

export const getAssetsList = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const assetModel = AssetModel();
  const companyModel = CompanyModel();
  const authenticatedHost = req.user;

  try {
    const hostscompanies = await companyModel.find({
      host: authenticatedHost._id,
    });
    const assetList =
      hostscompanies.length === 0
        ? hostscompanies
        : await assetModel.find({
            $or: hostscompanies.map(({ _id }) => ({ companyId: _id })),
          });

    //console.log("count", assetList.length);

    if (!assetList) return res.status(400).send('There are no Assets Yet');
    else {
      return res.status(200).send(assetList);
    }
  } catch (error) {
    next(error);
  }
};
