const { AuthModel, AssignmentModel, LaptopModel } = require("../models/index");
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
    const employee = await AuthModel.findById(req.params.id, { password: 0 });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const assignedLaptops = await AssignmentModel.find({
      employee: req.params.id,
      returnedAt: null,
    }).sort({ createdAt: -1 });

    const laptops = await Promise.all(
      assignedLaptops.map(async (assignment) => {
        const laptop = await LaptopModel.findById(assignment.laptop);
        return {
          assignmentId: assignment._id,
          assignedAt: assignment.createdAt,
          laptopDetails: laptop,
        };
      })
    );

    res.status(200).json({ employee, laptops, assignedLaptops, status: true });
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};
module.exports = { getAllEmployees, getEmployeeById };
