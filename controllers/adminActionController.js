const { AssignmentModel, LaptopModel } = require("../models/index");

const assignLaptop = async (req, res) => {
  try {
    if (req.user.role === "employee") {
      throw new Error("You are not authorized to perform this action");
    }
    const laptop = await LaptopModel.findByIdAndUpdate(req.body.laptop, {
      status: "assigned",
    });
    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }
    const assignment = new AssignmentModel(req.body);
    await assignment.save();
    res
      .json({ message: "Laptop assigned successfully", status: true })
      .status(201);
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};
const unassignLaptop = async (req, res) => {
  try {
    if (req.user.role === "employee") {
      throw new Error("You are not authorized to perform this action");
    }
    const laptop = await LaptopModel.findByIdAndUpdate(req.body.laptop, {
      status: "available",
    });
    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }
    const assignment = await AssignmentModel.findByIdAndUpdate(
      req.params.id,
      { returnedAt: Date.now(), status: "unassigned" },
      { new: true }
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};

const issueUpdate = async (req, res) => {
  try {
    if (req.user.role === "employee") {
      throw new Error("You are not authorized to perform this action");
    }
    const laptop = await LaptopModel.findByIdAndUpdate(req.body.laptop, {
      status: req.body.status === "resolved" ? "available" : "maintenance",
    });
    if (!laptop) {
      return res
        .status(404)
        .json({ message: "Laptop not found", status: false });
    }
    const issue = await IssueModel.findByIdAndUpdate(req.params.id, req.body);
    if (!issue) {
      return res
        .status(404)
        .json({ message: "Issue not found", status: false });
    }
    res.status(200).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};

module.exports = {
  assignLaptop,
  unassignLaptop,
  issueUpdate,
};
