const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LaptopSchema = new Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "assigned", "maintenance"],
      required: true,
      default: "available",
    },
    purchaseDate: { type: Date, required: true },
  },
  { strict: false, timestamps: true }
);
const LaptopModel = mongoose.model("Laptop", LaptopSchema);

const AuthSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    department: { type: String },
  },
  { strict: false, timestamps: true, collection: "auth" }
);
const AuthModel = mongoose.model("Auth", AuthSchema);

const requestSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Auth" },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
    description: { type: String, required: true },
  },
  { timestamps: true, strict: false, collection: "requests" }
);
const RequestModel = mongoose.model("Request", requestSchema);

//assignments: id, laptopId, employeeId, assignedAt, returnedAt.
const assignmentSchema = new Schema(
  {
    laptop: { type: Schema.Types.ObjectId, ref: "Laptop" },
    employee: { type: Schema.Types.ObjectId, ref: "Auth" },
    assignedAt: { type: Date, default: Date.now },
    returnedAt: { type: Date, default: null },
  },
  { timestamps: true, strict: false, collection: "assignments" }
);
const AssignmentModel = mongoose.model("Assignment", assignmentSchema);

// issues: id, laptopId, description, priority, status, reportedBy,reportedAt.
const issueSchema = new Schema(
  {
    laptop: { type: Schema.Types.ObjectId, ref: "Laptop" },
    description: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    status: {
      type: String,
      enum: ["raised", "resolved", "pending"],
      default: "raised",
    },
    reportedBy: { type: Schema.Types.ObjectId, ref: "Auth" },
    reportedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false, collection: "issues" }
);

const IssueModel = mongoose.model("Issue", issueSchema);

const maintenanceSchema = new Schema(
  {
    laptop: { type: Schema.Types.ObjectId, ref: "Laptop" },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
    cost: { type: Number },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false, collection: "maintenance" }
);

const MaintenanceModel = mongoose.model("Maintenance", maintenanceSchema);

//log schema to maintain history of assign,unassign,issueUpdate,laptop add,laptop delete, laptop update
const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "assign",
        "unassign",
        "issueUpdate",
        "laptop add",
        "laptop delete",
        "laptop update",
      ],
    },
    laptopId: { type: Schema.Types.ObjectId, ref: "Laptop" },
    description: { type: String },
    loggedAt: { type: Date, default: Date.now },
  },
  { strict: false, timestamps: true, collection: "logs" }
);

const LogModel = mongoose.model("Logs", logSchema);

module.exports = {
  LaptopModel,
  AuthModel,
  RequestModel,
  AssignmentModel,
  IssueModel,
  MaintenanceModel,
  LogModel,
};

LaptopSchema.pre("remove", async function (next) {
  try {
    const laptopId = this._id;
    await mongoose.model("Assignment").deleteMany({ laptop: laptopId });
    await mongoose.model("Issue").deleteMany({ laptop: laptopId });
    next();
  } catch (err) {
    next(err);
  }
});
LaptopModel.on("remove", function (doc) {
  console.log(`Laptop with id ${doc._id} has been removed.`);
});
