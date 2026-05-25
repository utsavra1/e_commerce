import { Router } from "express";
import { addAddress, getAddresses, removeAddress } from "../controllers/address.ts";
import { authenticate } from "../middleware/auth.ts";
import validate from "../middleware/validate.ts";
import { addressSchema } from "../schemas/address.ts";

const router = Router();

router.post("/", authenticate, validate(addressSchema), addAddress);
router.get("/", authenticate, getAddresses);
router.delete("/:id", authenticate, removeAddress);

export default router;
