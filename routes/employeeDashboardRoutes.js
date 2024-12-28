const express = require("express");
const {
  getAssignmentsByEmployeeId,
  getEmployeeHistory,
  newRequest,
  getPendingRequestsByEmployeeId,
  getRequestsByEmployeeId,
  reportLaptopIssue,
  returnLaptop,
  getReportsOfEmployee,
} = require("../controllers/employeeDashboardControllers");

const router = express.Router();
router.get("/assigned", getAssignmentsByEmployeeId);
router.get("/history", getEmployeeHistory);
router.get("/pending-requests", getPendingRequestsByEmployeeId);
router.get("/all-requests", getRequestsByEmployeeId);
router.post("/report-issue", reportLaptopIssue);
router.post("/new-request", newRequest);
router.patch("/return", returnLaptop);
router.get("/reports", getReportsOfEmployee);
module.exports = router;
