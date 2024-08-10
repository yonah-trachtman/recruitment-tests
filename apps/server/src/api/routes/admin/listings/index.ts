import { Router } from 'express';
import handlerHOC from '../../index';
import { Status } from '@offisito-shared';
import {
  getAllAssets,
  findAssetsByPublishingStatus,
  updateAssetStatus,
} from '../../../../controllers/admin/listings/index';

const router = Router();

router.get(
  '/all',
  handlerHOC(async (req) => {
    const allAssets = await getAllAssets();
    return { statusCode: 200, body: allAssets };
  }),
);
router.get(
  '/pending',
  handlerHOC(async (req) => {
    const pendingAssets = await findAssetsByPublishingStatus(Status.Pending);
    return { statusCode: 200, body: pendingAssets };
  }),
);
router.get(
  '/suspended',
  handlerHOC(async (req) => {
    const suspendedAssets = await findAssetsByPublishingStatus(
      Status.Suspended,
    );
    return { statusCode: 200, body: suspendedAssets };
  }),
);
router.put(
  '/approve/:id',
  handlerHOC(async (req) => {
    const listingId = req.params.id;
    await updateAssetStatus(listingId, Status.Active);
    return { statusCode: 201, body: `Listing ${listingId} is now Active` };
  }),
);

router.put(
  '/suspend/:id',
  handlerHOC(async (req) => {
    const listingId = req.params.id;
    await updateAssetStatus(listingId, Status.Suspended);
    return { statusCode: 201, body: `Listing ${listingId} is Suspended` };
  }),
);

export default router;
