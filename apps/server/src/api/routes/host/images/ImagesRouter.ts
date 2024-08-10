import { Router } from 'express';
import { getAssetImageAws } from '../../../../controllers/host/images/read_asset_images';
import { uploadAndUpdateFloorImages } from '../../../../controllers/host/images/add_floor_images';
import { uploadAndUpdateBuildingImage } from '../../../../controllers/host/images/add_building_images';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import assetModel from '../../../../services/mongo/assets/assetModel';
import { AuthenticatedRequest } from '@auth-backend';
import sharp from 'sharp';
import { TODO } from '@base-shared';
import companyModel from '../../../../services/mongo/assets/companyModel';
import { s3Client, uploadFile, s3Settings } from '@s3-backend';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.put(
  '/upload_asset_img/:asset_id',
  upload.array('files', 6),
  async (req: AuthenticatedRequest, res, next) => {
    if (!req.user) return res.status(401).send('Please Login');
    if (!(req.files && 'map' in req.files))
      return res.status(400).send('No files received');
    if (!req.params.asset_id)
      return res.status(400).send('No asset_id received');

    try {
      const asset = await assetModel().findById(req.params.asset_id);
      const promises = (req.files as typeof req.files & { map: TODO }).map(
        async (file: TODO) => {
          try {
            const resizedImageBuffer = await sharp(file.buffer)
              .resize(960, 540)
              .toBuffer();

            const originalKey = `asset/${req.params.asset_id}/pictures/org_${file.originalname}`;
            const resizedKey = `asset/${req.params.asset_id}/pictures/${file.originalname}`;

            await uploadFile(originalKey, file.buffer, file.mimetype);

            await uploadFile(resizedKey, resizedImageBuffer, file.mimetype);

            return resizedKey;
          } catch (error) {
            console.error('Error uploading file: ', error);
            throw error; // Rethrow to be caught by Promise.all
          }
        },
      );

      Promise.all(promises)
        .then(async (keys) => {
          asset.photos = [...asset.photos, ...keys];
          await asset.save();
          res.status(201).send('Photo updated successfully');
        })
        .catch((error) => {
          next(error); // Handle the error from Promise.all
        });
    } catch (error) {
      next(error);
    }
  },
);

router.put('/cropPicture', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send('Please Login');
    const { key, assetId, crop } = req.body;
    const { width, height, x, y } = crop;
    if (!width && width !== 0) return res.status(400).send('No width received');
    if (!height && height !== 0)
      return res.status(400).send('No height received');
    if (!x && x !== 0) return res.status(400).send('No x received');
    if (!y && y !== 0) return res.status(400).send('No y received');

    if (!key) return res.status(400).send('No picture key received');

    if (!assetId) return res.status(400).send('No asset id received');

    const asset = await assetModel().findById(assetId);

    if (!asset) return res.status(404).send('No asset with this id found');

    if (!asset.photos.some((picture) => picture === key))
      return res
        .status(404)
        .send('No picture with this key found in this asset');

    const command = new GetObjectCommand({
      Bucket: s3Settings.s3BucketName,
      Key: key,
    });
    const { Body } = await s3Client.send(command);

    if (Body instanceof ReadableStream || Body instanceof Blob) {
      console.error(
        'Handling of the Body depends on your environment (Node.js or browser).',
      );
      return res.status(500).send('Error processing image data');
    }

    const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      Body.on('data', (chunk) => chunks.push(chunk));
      Body.on('end', () => resolve(Buffer.concat(chunks)));
      Body.on('error', reject);
    });

    console.log({
      width: parseInt(width),
      height: parseInt(height),
      left: parseInt(x),
      top: parseInt(y),
    });

    const croppedImage = await sharp(imageBuffer)
      .extract({
        width: parseInt(width),
        height: parseInt(height),
        left: parseInt(x),
        top: parseInt(y),
      })
      .toBuffer();

    // Saving the cropped image back to S3 using SDK v3
    const newKey = `cropped-${key}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Settings.s3BucketName,
        Key: newKey,
        Body: croppedImage,
        ContentType: 'image/jpeg', // Adjust based on your image type
      }),
    );

    console.log(`Image cropped and saved as ${newKey}`);
    res.send({ message: `Image cropped and saved as ${newKey}` });
  } catch (error) {
    console.error('Error processing request:', error);
    next(error);
  }
});

router.delete(
  '/:assetId/:key',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) return res.status(401).send('not logged in');
      const { assetId, key } = req.params;
      const iKey = Buffer.from(key, 'base64').toString('ascii');
      if (!assetId) return res.status(400).send('no asset id');
      const asset = await assetModel().findById(assetId);
      if (!asset) return res.status(404).send('no asset with this id');
      const company = await companyModel().findById(asset.companyId);
      if (String(company?.host) !== String(req.user._id))
        return res.status(401).send('not your asset');
      if (!iKey) return res.status(400).send('no key');
      asset.photos = asset.photos.filter((k) => k !== iKey);
      await asset.save();
      return res.status(200).send('success');
    } catch (e) {
      next(e);
    }
  },
);

router.get('/get_image_aws/:key*', getAssetImageAws);

router.put(
  '/upload_floor_image/:company_id/:floor_number',
  uploadAndUpdateFloorImages,
);

router.put('/upload_building_image/:building_id', uploadAndUpdateBuildingImage);

export default router;
