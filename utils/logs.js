const { LogModel } = require("../models/index");
const createLog = async (logData) => {
  try {
    const log = new LogModel(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error("Error creating log:", error);
    throw error;
  }
};

module.exports = createLog;
