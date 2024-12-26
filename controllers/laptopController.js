const { default: mongoose } = require("mongoose");
const { LaptopModel } = require("../models/index");
const getAllLaptops = async (req, res) => {
  try {
    const laptops = await LaptopModel.find();
    res.json(laptops).status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
const getLaptopById = async (req, res) => {
  try {
    const laptop = await LaptopModel.findById(req.params.id);
    res.json(laptop).status(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const addNewLaptop = async (req, res) => {
  try {
    const laptop = new LaptopModel(req.body);
    await laptop.save();
    res.json(laptop).status(201);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateLaptop = async (req, res) => {
  try {
    const laptop = await LaptopModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }

    res.status(200).json(laptop);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteLaptop = async (req, res) => {
  try {
    const laptop = await LaptopModel.findByIdAndDelete(req.params.id);
    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }
    res.status(200).json({ message: "Laptop deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getUnassigned = async (req, res) => {
  try {
    const laptops = await LaptopModel.find({ status: "available" });
    res.json(laptops).status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  getAllLaptops,
  getLaptopById,
  addNewLaptop,
  updateLaptop,
  getUnassigned,
};
