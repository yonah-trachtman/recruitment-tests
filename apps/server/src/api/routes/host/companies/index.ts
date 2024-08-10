import { NextFunction, Request, Response, Router } from "express";
import {
  createCompanyId,
  addCompanyLeaseData,
} from "../../../../controllers/host/companies/add_company";
import {
  getCompanyDetail,
  companiesList,
} from "../../../../controllers/host/companies/get_company";
import { editCompanyDetail } from "../../../../controllers/host/companies/edit_company";
import { deleteCompany } from "../../../../controllers/host/companies/delete_company";
import {
  addFloor,
  editFloor,
  deleteFloor,
} from "../../../../controllers/host/companies/floorCrud";

const router = Router();

export const validateCompanyReq = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  console.log(body);

  if (!Array.isArray(body.floor)) {
    return res.status(400).json({ error: "Please check Floor structure" });
  }

  if (!body.floor[0].floorNumber) {
    return res.status(400).json({ error: "Please enter Floor Number" });
  }

  next();
};

// Company Routers
router.post("/create_company_id", createCompanyId);
router.put("/add_company_lease", validateCompanyReq, addCompanyLeaseData);
router.get("/get_company_lease/:company_id", getCompanyDetail);
router.put("/edit_company_lease/:company_id", editCompanyDetail);
router.delete("/delete_company_lease/:company_id", deleteCompany);
router.get("/get_companies_list", companiesList);

// Floor Router
router.put("/add_floor", addFloor);
router.put("/edit_floor", editFloor);
router.delete("/delete_floor", deleteFloor);

export default router;
