const {
  AssignmentModel,
  LaptopModel,

  IssueModel,
  RequestModel,
  LogModel,
} = require("../models/index");
const createLog = require("../utils/logs");

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
    const assignment = new AssignmentModel({
      laptop: req.body.laptop,
      employee: req.body.employee,
      assignedAt: Date.now(),
    });
    const assign = await assignment.save();
    await createLog({
      action: "create",
      description: `Laptop ${laptop.brand}-${laptop.model} assigned to Employee `,
      category: "assigned laptop",
      assignId: assign._id,
    });

    res
      .status(201)
      .json({ message: "Laptop assigned successfully", status: true });
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
    const laptop = await LaptopModel.findByIdAndUpdate(assignment.laptop, {
      status: "available",
    });
    await createLog({
      action: "update",
      description: `Laptop ${laptop.brand}-${laptop.model} unassigned `,
      category: "unassigned laptop",
      assignId: assignid,
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
        await createLog({
          action: "update",
          description: `Laptop ${laptop.brand}-${laptop.model}  issue resolved `,
          category: "issue resolved",
          issueId: req.assign._id,
        });
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
    await createLog({
      action: status,
      description: `Request action ${status} `,
      category: status === "approved" ? "request approved" : "request rejected",
      requestId,
    });

    return res
      .status(200)
      .json({ message: "Request action complete", status: true });
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};
const getAllLogs = async (req, res) => {
  try {
    const logs = await LogModel.find({}, {}, { sort: { createdAt: -1 } });
    if (!logs) {
      return res.status(404).json({ message: "No logs found", status: false });
    }
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};

const getCounts = async (req, res) => {
  try {
    const total = await LaptopModel.countDocuments({});
    const assigned = await LaptopModel.countDocuments({
      status: "assigned",
    });
    const available = await LaptopModel.countDocuments({
      status: "available",
    });
    const maintenance = await LaptopModel.countDocuments({
      status: "maintenance",
    });
    const totalissues = await IssueModel.countDocuments({});

    const pending = await IssueModel.countDocuments({
      status: "pending",
    });
    const resolved = await IssueModel.countDocuments({
      status: "resolved",
    });
    const totalReq = await RequestModel.countDocuments({});
    const approvedReq = await RequestModel.countDocuments({
      status: "approved",
    });
    const rejectedReq = await RequestModel.countDocuments({
      status: "rejected",
    });
    const pendingReq = await RequestModel.countDocuments({ status: "pending" });
    res.status(200).json({
      laptops: { total, assigned, available, maintenance },
      issues: { total: totalissues, pending, resolved },
      requests: {
        total: totalReq,
        approved: approvedReq,
        pending: pendingReq,
        rejected: rejectedReq,
      },
    });
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
  getAllLogs,
  getCounts,
};
