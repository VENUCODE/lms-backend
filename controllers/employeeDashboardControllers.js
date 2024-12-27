const getAssigned = async (req, res) => {
  try {
    const assignedHistory = await AssignedHistoryModel.find({
      employee: req.params.id,
      returnedAt: null,
    })
      .sort({ returnedAt: 1 })
      .populate("laptop", "serialNumber brand model");

    res.status(200).json(assignedHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
