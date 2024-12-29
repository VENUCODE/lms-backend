const router = require("express").Router();
const {
  getAllLaptops,
  getLaptopById,
  addNewLaptop,
  updateLaptop,
  deleteLaptop,
  getUnassigned,
} = require("../controllers/laptopController");
router.get("/getall", getAllLaptops);
router.get("/getunassigned", getUnassigned);
router.get("/get/:id", getLaptopById);
router.post("/addnew", addNewLaptop);
router.put("/update/:id", updateLaptop);
router.delete("/delete/:id", deleteLaptop);

module.exports = router;
