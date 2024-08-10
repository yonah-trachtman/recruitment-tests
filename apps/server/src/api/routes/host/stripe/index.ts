import { Router } from "express";
import handlerHOC from "../../index";

const router = Router();

router.post(
  "/createAndLinkConnectedAccount",
  handlerHOC(async (req) => {
    const { user } = req.body;

    return { statusCode: 200, body: "success" };
  }),
);
