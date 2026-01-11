import express from "express";
import { 
  registerFamily, 
  getFamilyDetails, 
  updateFamilyStatus,
  updateFamilyDetails,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from "../controllers/familyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register family
router.post("/register", authMiddleware, registerFamily);

// Get family details
router.get("/details", authMiddleware, getFamilyDetails);

// Update family details
router.put("/update", authMiddleware, updateFamilyDetails);

// Update family payment status
router.put("/status/:familyId", authMiddleware, updateFamilyStatus);

// Family members endpoints
router.post("/members", authMiddleware, addFamilyMember);
router.put("/members/:memberId", authMiddleware, updateFamilyMember);
router.delete("/members/:memberId", authMiddleware, deleteFamilyMember);

export default router;
