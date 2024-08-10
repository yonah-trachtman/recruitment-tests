import { Router } from "express";
import {
  createAssetId,
  addAsset,
} from "../../../../controllers/host/assets/add_asset";
import {
  editAsset,
  publishAsset,
} from "../../../../controllers/host/assets/edit_asset";
import {
  getAssetDetail,
  getAssetsList,
} from "../../../../controllers/host/assets/read_asset";
import { deleteAsset } from "../../../../controllers/host/assets/delete_asset";
import imageRouter from "../images/ImagesRouter";

const assetsRouter = Router();

// Assets Router
assetsRouter.post("/get_asset_id", createAssetId);
// assetsRouter.post("/add_asset", uploadManyAssetsImages, addAsset);
assetsRouter.put("/add_asset", addAsset);
assetsRouter.get("/asset_detail/:asset_id", getAssetDetail);
assetsRouter.put("/edit_asset/:asset_id", editAsset);
assetsRouter.get("/assets_list", getAssetsList);
assetsRouter.delete("/delete_asset/:asset_id", deleteAsset);
assetsRouter.put("/publish_asset/:asset_id", publishAsset);
assetsRouter.put("/publish_asset/:asset_id", publishAsset);
assetsRouter.use("/images", imageRouter);

export default assetsRouter;
