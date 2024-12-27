const { AssignmentModel, LaptopModel, LogModel } = require("../models/index");

const assignLaptop = async (req, res) => {
  try {
    if (req.user.role === "employee") {
      throw new Error("You are not authorized to perform this action");
    }
    const laptop = await LaptopModel.findByIdAndUpdate(req.body.laptop, {
      status: "assigned",
    });
    if (!laptop) {
      return res
        .status(404)
        .json({ message: "Laptop not found", status: false });
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
    const assignid = req.params.id;
    const assignment = await AssignmentModel.findByIdAndUpdate(
      assignid,
      { returnedAt: Date.now() },
      { new: true }
    );
    await LaptopModel.findByIdAndUpdate(assignment.laptop, {
      status: "available",
    });
    res.status(200).json({ message: "unassigned succesfully", status: true });
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
