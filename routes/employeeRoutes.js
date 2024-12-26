const router = require("express").Router();
const {
  getAllEmployees,
  getEmployeeById,
} = require("../controllers/EmployeeController");

router.get("/getall", getAllEmployees);
router.get("/get/:id", getEmployeeById);

module.exports = router;
