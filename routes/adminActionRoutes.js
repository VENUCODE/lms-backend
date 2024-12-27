// assign,unassign,issueUpdate
const router = require("express").Router();
const {
  assignLaptop,
  unassignLaptop,
  issueUpdate,
  getAllIssues,
  getAllRequests,
  requestAction,
} = require("../controllers/adminActionController");

router.post("/assign", assignLaptop);
router.put("/unassign/:id", unassignLaptop);
router.patch("/issue/:id", issueUpdate);
router.get("/issues", getAllIssues);
router.get("/requests", getAllRequests);
router.put("/request-action/:id", requestAction);
module.exports = router;
