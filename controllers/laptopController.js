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
    const prev = await LaptopModel.findOne({
      serialNumber: req.body.serialNumber,
    });

    if (prev) {
      return res
        .status(400)
        .json({ message: "Laptop already Exists", status: false });
    }

    const laptop = new LaptopModel(req.body);
    await laptop.save();

    return res.status(201).json({ status: true, message: "Laptop added" });
  } catch (err) {
    return res.status(500).json({ error: err.message, status: false });
  }
};

const updateLaptop = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({
        message: "Unauthorized access 3 " + req.user.role,
        status: false,
      });
    }
    const laptop = await LaptopModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!laptop) {
      return res
        .status(404)
        .json({ message: "Laptop not found", status: false });
    }

    res
      .status(200)
      .json({ message: "Laptop updated Successfully", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteLaptop = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "Unauthorized access 3", status: false });
    }
    const laptop = await LaptopModel.findByIdAndDelete(req.params.id);
    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }
    res.status(200).json({ message: "Laptop deleted", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getUnassigned = async (req, res) => {
  try {
    const laptops = await LaptopModel.find({ status: "available" });
    res.json({ laptops, status: true }).status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, status: false });
  }
};
module.exports = {
  getAllLaptops,
  getLaptopById,
  addNewLaptop,
  updateLaptop,
  getUnassigned,
  deleteLaptop,
};
