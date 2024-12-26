const router = require("express").Router();
const {
  getAllLaptops,
  getLaptopById,
  addNewLaptop,
  updateLaptop,
} = require("../controllers/LaptopController");
router.get("/getall", getAllLaptops);
router.get("/get/:id", getLaptopById);
router.post("/addnew", addNewLaptop);
router.patch("/update/:id", updateLaptop);

module.exports = router;
