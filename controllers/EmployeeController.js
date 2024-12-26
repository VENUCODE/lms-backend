const { AuthModel } = require("../models/index");
const getAllEmployees = async (req, res) => {
  try {
    const employees = await AuthModel.find(
      { role: "employee" },
      { password: 0 }
    );
    res.json(employees).status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
const getEmployeeById = async (req, res) => {
  try {
    const employee = await AuthModel.findById(req.params.id);
    res.json(employee).status(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getAllEmployees, getEmployeeById };
