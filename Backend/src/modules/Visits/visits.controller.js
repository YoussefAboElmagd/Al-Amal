import { visitModel } from "../../../database/models/visit.model.js";

const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createVisit = catchAsyncError(async (req, res, next) => {
  
  const { title, content, tags } = req.body;
  const author = req.user._id;

  const newVisit = new visitModel({ title, content, author, tags });
  const savedVisit = await newVisit.save();

  res.status(201).json({
    message: "Visit created successfully!",
     savedVisit
  });
});

const editVisit = catchAsyncError(async (req, res, next) => {
  const visitId = req.params;

  const updatedVisit = await visitModel.findByIdAndUpdate(
    visitId,
    req.body,
    { new: true }
  );

  if (!updatedVisit) {
    return res.status(404).json({ message: "Visit not found!" });
  }

  res.status(200).json({
    message: "Visit updated successfully!",
    updatedVisit
  });
});

const deleteVisit = catchAsyncError(async (req, res, next) => {
  const visitId = req.params.visitId;

  const deletedVisit = await visitModel.findByIdAndDelete(visitId);

  if (!deletedVisit) {
    return res.status(404).json({ message: "Visit not found!" });
  }

  res.status(200).json({ message: "Visit deleted successfully!" });
});

const getAllVisits = catchAsyncError(async (req, res, next) => {
  let results = await visitModel.find();
  res.json({ message: "done", results });
});

export { createVisit, editVisit, deleteVisit,getAllVisits };
