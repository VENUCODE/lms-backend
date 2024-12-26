const router = require("express").Router();
const {
  getAllLaptops,
  getLaptopById,
  addNewLaptop,
  updateLaptop,
  getUnassigned,
} = require("../controllers/LaptopController");
router.get("/getall", getAllLaptops);
router.get("/getunassigned", getUnassigned);
router.get("/get/:id", getLaptopById);
router.post("/addnew", addNewLaptop);
router.patch("/update/:id", updateLaptop);

module.exports = router;
