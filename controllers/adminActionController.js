const {
  AssignmentModel,
  LaptopModel,
  LogModel,
  IssueModel,
  RequestModel,
} = require("../models/index");

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
    if (req.body.status === "resolved") {
      const assign = await AssignmentModel.findOne({
        laptop: req.body.assignment,
        returnedAt: null,
      });
      if (assign) {
        await AssignmentModel.findByIdAndUpdate(assign._id, {
          returnedAt: Date.now(),
        });
      }
    }

    const issue = await IssueModel.findByIdAndUpdate(req.params.id, req.body);
    if (!issue) {
      return res
        .status(404)
        .json({ message: "Issue not found", status: false });
    }
    res.status(200).json({ message: "Issue Updated/Resolved", status: true });
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await IssueModel.find(
      { status: { $in: ["raised", "pending"] } },
      {},
      { sort: { createdAt: -1 } }
    )
      .populate("laptop", "brand serialNumber model")
      .populate("employee", "email");
    if (!issues) {
      return res
        .status(404)
        .json({ message: "No issues found", status: false });
    }
    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};
const getAllRequests = async (req, res) => {
  try {
    const requests = await RequestModel.find(
      {
        status: "pending",
      },
      { closedOn: 0 }
    ).populate("employee", "email");
    res.status(200).json({ data: requests, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const requestAction = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    await RequestModel.findByIdAndUpdate(
      requestId,
      { status, closedOn: Date.now() },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Request action complete", status: true });
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};
module.exports = {
  assignLaptop,
  unassignLaptop,
  issueUpdate,
  getAllIssues,
  getAllRequests,
  requestAction,
};
