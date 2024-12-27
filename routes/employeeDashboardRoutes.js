const express = require("express");
const {
  getAssignmentsByEmployeeId,
  getEmployeeHistory,
  newRequest,
  getPendingRequestsByEmployeeId,
  getRequestsByEmployeeId,
  reportLaptopIssue,
} = require("../controllers/employeeDashboardControllers");

const router = express.Router();
router.get("/assigned/:id", getAssignmentsByEmployeeId);
router.get("/history/:id", getEmployeeHistory);
router.get("/pending-requests/:id", getPendingRequestsByEmployeeId);
router.get("/all-requests/:id", getRequestsByEmployeeId);
router.post("/report-issue/:id", reportLaptopIssue);
router.post("/new-request/:id", newRequest);
module.exports = router;
