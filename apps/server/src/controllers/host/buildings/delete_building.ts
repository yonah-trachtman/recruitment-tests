import { Response } from 'express';
import BuildingModel from '../../../services/mongo/assets/buildingModel';
import { AuthenticatedRequest } from '@auth-backend';
import { isValidObjectId } from 'mongoose';

export const deleteBuilding = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const buildingModel = BuildingModel();
  const host = req.user;
  const building_id = req.params.building_id;
  try {
    if (!isValidObjectId(host)) {
      return res.status(401).json({ msg: 'Unhautorized User' });
    }

    const deletedBuilding = await buildingModel.findOneAndDelete({
      _id: building_id,
    });

    if (!deleteBuilding) {
      return res.status(400).json({ msg: 'unavailable Building ID' });
    }

    return res
      .status(201)
      .send(`Building ${deletedBuilding.buildingName} is deleted`);
  } catch (error) {
    next(error);
  }
};
