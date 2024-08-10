import { AmenityType } from '@offisito-shared';
import AmenityModel from '../../../services/mongo/amenities/amenityModel';
import { validateExisting } from '../../';

const validateAmenityType = (type: string): boolean | string[] => {
  const types = Object.values(AmenityType);
  return types.some((value) => value === type) || types;
};

const createNewAmenity = async (validName: string, validType: string) => {
  const res = await new (AmenityModel())({
    name: validName,
    type: validType,
  }).save();
  return res;
};

const updateAmenity = async (
  id: string,
  validName: string,
  validType: AmenityType,
) => {
  const doc = await AmenityModel().findById(id);
  if (!doc)
    return { statusCode: 404, body: "Amenity with this ID was'nt found" };
  if (validName) doc.name = validName;
  if (validType) doc.type = validType;
  await doc.save();
};

export const validateAndCreateAmenity = async (name: string, type: string) => {
  if (!validateExisting(name))
    return { statusCode: 400, body: 'Name is required' };
  if (!validateExisting(type))
    return { statusCode: 400, body: 'Type is required' };
  const typeValidity = validateAmenityType(type);
  console.log('creating amme');
  if (typeValidity !== true)
    return {
      statusCode: 400,
      body: 'type must be one of these: ' + JSON.stringify(typeValidity),
    };
  const createAmmenity = await createNewAmenity(name, type);
  return {
    statusCode: 200,
    body: createAmmenity,
  };
};

export const validateAndUpdateAmenity = async (
  id: string,
  name: string,
  type: AmenityType,
) => {
  if (!validateExisting(id)) return { statusCode: 400, body: 'ID is required' };
  const typeValidity = !validateAmenityType(type);
  if (typeValidity !== true)
    return {
      statusCode: 400,
      body: 'type must be one of these: ' + JSON.stringify(typeValidity),
    };
  await updateAmenity(id, name, type);
};

export const deleteAmenity = async (id: string) => {
  await AmenityModel().deleteOne({ _id: id });
};
