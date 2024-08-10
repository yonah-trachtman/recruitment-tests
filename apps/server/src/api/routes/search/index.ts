import { Router } from 'express';
import { AuthenticatedRequest } from '@auth-backend';
import { Status, Query, Area } from '@offisito-shared';
import assetModel from '../../../services/mongo/assets/assetModel';
import { getPointByAddress } from '../../../services/google-geocoding';
import { signUrls } from '../../../controllers/host/assets/read_asset';
import companyModel from '../../../services/mongo/assets/companyModel';
import { user } from '@auth-backend';
import { TODO } from '@base-shared';
import { preSignFile } from '@s3-backend';

const router = Router();

router.get('/single/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.params.id) return res.status(400).send('No id received');
    const asset = (await assetModel().findById(req.params.id)).toObject();
    asset.photoURLs = await signUrls(asset.photos);
    return res.status(200).json(asset);
  } catch (e) {
    next(e);
  }
});

router.get(
  '/:stringifiedQuery',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.params.stringifiedQuery)
        return res.status(400).send('No Query received');
      const { config, params }: Query = JSON.parse(req.params.stringifiedQuery);
      const query = {
        publishingStatus: Status.Active,
      };
      if (params.location) {
        const location = params.location as Area & {
          lat: number;
          long: number;
          address: string;
        };
        let { lat, long } = location;
        const { address, radius } = location;
        if (!lat) {
          const { lat: nlat, lng } = await getPointByAddress(address);
          lat = nlat;
          long = lng;
        }
        query['location'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [long, lat],
            },
            $maxDistance: radius,
          },
        };
      }
      if (params.minPricePerMonth || params.maxPricePerMonth) {
        query['leaseCondition.monthlyPrice'] = {};
        if (params.minPricePerMonth) {
          query['leaseCondition.monthlyPrice']['$gte'] =
            params.minPricePerMonth;
        }
        if (params.maxPricePerMonth) {
          query['leaseCondition.monthlyPrice']['$lte'] =
            params.maxPricePerMonth;
        }
      }
      if (params.asset_type) {
        query['assetType'] = params.asset_type;
      }
      if (params.requiredAmenities && params.requiredAmenities.length > 0) {
        query['assetAmenities.name'] = { $all: params.requiredAmenities };
      }

      const limit = config.limit || 10;
      const skip = config.offset || 0;

      const assets = (
        await assetModel().find(query).limit(limit).skip(skip)
      ).map((r) => r.toObject());

      for (const element of assets)
        if (element.photos?.length > 0)
          element.photoURLs = await signUrls(element.photos);
      return res.status(200).json(assets);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  '/hostData/:companyId',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) return res.status(401).send('not looged in');
      if (!req.params.companyId) return res.status(400).send('no id received');
      const company = await companyModel().findById(req.params.companyId);
      const host: TODO = await user(false, false, false).findById(company.host);
      let pictureUrl = '';
      if (host.profilePictureUrlKey) {
        const imageSize = req.params.size as '128' | undefined;
        let key = (req.user as TODO).profilePictureUrlKey;
        if (imageSize === '128') {
          key = key.replace(/(\/profile-pictures\/)/, `$1128_`);
        }
        pictureUrl = await preSignFile(key);
      }
      return res.status(200).json({
        hostName: host.full_name,
        companyName: company.companyName,
        hostCreateDate: host.createdAt,
        pictureUrl,
      });
    } catch (e) {
      next(e);
    }
  },
);

export default router;
