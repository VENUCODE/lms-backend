const {
  AssignmentModel,
  RequestModel,
  IssueModel,
  LaptopModel,
} = require("../models/index");
const getAssignmentsByEmployeeId = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const assignments = await AssignmentModel.find(
      {
        employee: employeeId,
        returnedAt: null,
      },
      { employee: 0 }
    ).populate("laptop", "brand model serialNumber status purchaseDate");

    res.status(200).json({ data: assignments, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const getEmployeeHistory = async (req, res) => {
  try {
    const employeeId = req.user.id;

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
const getReportsOfEmployee = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const reports = await IssueModel.find(
      {
        employee: employeeId,
      },
      { employee: 0 }
    ).sort({ updatedAt: -1 });

    res.status(200).json({ data: reports, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const newRequest = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("No user token found");
    }
    const { description } = req.body;
    const request = new RequestModel({ description, employee: req.user.id });
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
    const employeeId = req.user.id;
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
    const employeeId = req.user.id;
    const requests = await RequestModel.find(
      {
        employee: employeeId,
      },
      { employee: 0 }
    ).sort({ createdAt: -1 });
    res.status(200).json({ data: requests, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
const reportLaptopIssue = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { laptop, description, priority } = req.body;

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
const returnLaptop = async (req, res) => {
  try {
    const { laptopId } = req.body;
    const employeeId = req.user.id;

    const assignment = await AssignmentModel.findOneAndUpdate(
      { laptop: laptopId, employee: employeeId, returnedAt: null },
      { returnedAt: new Date() },
      { new: true }
    );

    if (!assignment) {
      throw new Error("Assignment not found or already returned");
    }
    await LaptopModel.findByIdAndUpdate(laptopId, { status: "available" });

    res
      .status(200)
      .json({ message: "Laptop returned successfully", status: true });
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
  returnLaptop,
  getReportsOfEmployee,
};
