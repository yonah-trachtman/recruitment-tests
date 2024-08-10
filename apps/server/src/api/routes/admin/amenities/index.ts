import { Router } from "express";
import handlerHOC from "../../index";
import {
  deleteAmenity,
  validateAndCreateAmenity,
  validateAndUpdateAmenity,
} from "../../../../controllers/admin/amenities";

const router = Router();

router.post(
  "/",
  handlerHOC(async (req) => {
    const { name, type } = req.body;
    return await validateAndCreateAmenity(name, type);
    //return { statusCode: 200, body: "success" };
  }),
);

router.put(
  "/:id",
  handlerHOC(async (req) => {
    const id = req.params.id;
    const { name, type } = req.body;
    await validateAndUpdateAmenity(id, name, type);
    return { statusCode: 200, body: "success" };
  }),
);

router.delete(
  "/:id",
  handlerHOC(async (req) => {
    const id = req.params.id;
    await deleteAmenity(id);
    return { statusCode: 200, body: "success" };
  }),
);

export default router;
