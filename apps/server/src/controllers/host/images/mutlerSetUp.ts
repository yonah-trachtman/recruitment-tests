import multer from 'multer';
import { s3Client, s3Settings } from '@s3-backend';
import { settings } from '../../../config';
import multerS3 from 'multer-s3';
import { StagingEnvironment } from '@base-backend';

const checkFileType = (file, cb) => {
  console.log('Ceking the files ', file);

  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const uploadImagesMulter = (sub_bucket, object_id, max_upload) => {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: s3Settings.s3BucketName,
      metadata: (req, file, callBack) => {
        callBack(null, { fieldName: file.fieldname });
      },
      key: (req, file, callBack) => {
        const uniqueId = Math.floor(Math.random() * 1e6);
        const fullPath = `${sub_bucket}/${object_id}/${file.originalname}`;
        callBack(null, fullPath);
      },
    }),
    limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).array('images', max_upload);
};

export default uploadImagesMulter;
