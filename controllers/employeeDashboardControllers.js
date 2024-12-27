const {
  AssignmentModel,
  RequestModel,
  IssueModel,
  LaptopModel,
} = require("../models/index");
const getAssignmentsByEmployeeId = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const assignments = await AssignmentModel.find(
      {
        employee: employeeId,
        returnedAt: null,
      },
      { employee: 0 }
    ).populate("laptop", "brand model serialNumber");

    res.status(200).json({ data: assignments, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const getEmployeeHistory = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const assignments = await AssignmentModel.find(
      {
        employee: employeeId,
        returnedAt: { $ne: null },
      },
      { employee: 0 }
    ).populate("laptop", "brand model serialNumber");

    res.status(200).json({ data: assignments, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const newRequest = async (req, res) => {
  try {
    const { description } = req.body;
    const request = new RequestModel({ description, employee: req.params.id });
    await request.save();
    res
      .status(201)
      .json({ message: "Request sent successfully", status: true });
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};
const getPendingRequestsByEmployeeId = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const requests = await RequestModel.find(
      {
        employee: employeeId,
        status: "pending",
      },
      { employee: 0 }
    );
    res.status(200).json({ data: requests, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
const getRequestsByEmployeeId = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const requests = await RequestModel.find(
      {
        employee: employeeId,
      },
      { employee: 0 }
    );
    res.status(200).json({ data: requests, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
const reportLaptopIssue = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { laptop, description, priority } = req.body;
    const exists = IssueModel.find({ laptop, status: "pending" });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Issue reported already", status: false });
    }
    const issue = new IssueModel({
      laptop,
      priority: priority,
      employee: employeeId,
      description,
    });
    await issue.save();

    res
      .status(201)
      .json({ message: "Issue reported successfully", status: true });
  } catch (err) {
    res.status(500).json({ message: err.message, status: false });
  }
};
module.exports = {
  getAssignmentsByEmployeeId,
  getEmployeeHistory,
  newRequest,
  getPendingRequestsByEmployeeId,
  getRequestsByEmployeeId,
  reportLaptopIssue,
};
