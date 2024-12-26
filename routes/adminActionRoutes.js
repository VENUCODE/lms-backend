// assign,unassign,issueUpdate
const router = require("express").Router();
const {
  assignLaptop,
  unassignLaptop,
  issueUpdate,
} = require("../controllers/adminActionController");

router.post("/assign", assignLaptop);
router.put("/unassign/:id", unassignLaptop);
router.put("/issue/:id", issueUpdate);
module.exports = router;
