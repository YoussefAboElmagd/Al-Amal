import { transModel } from "../../../database/models/trans.model.js";

const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createTrans = catchAsyncError(async (req, res, next) => {
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, date, location, companyId } = req.body;

  const newTrans = new transModel({
    title,
    description,
    date,
    location,
    companyId,
  });
  const savedTrans = await newTrans.save();

  res.status(201).json({
    message: "Trans created successfully!",
     savedTrans
  });
});
const getAllTrans = catchAsyncError(async (req, res, next) => {
  let results = await transModel.find();
  res.json({ message: "done", results });
});

const editTrans = catchAsyncError(async (req, res, next) => {
  const TransId = req.params.TransId;
  const { title, description, date, location } = req.body;

  const updatedTrans = await findByIdAndUpdate(
    TransId,
    { title, description, date, location },
    { new: true }
  );

  if (!updatedTrans) {
    return res.status(404).json({ message: "Trans not found!" });
  }

  res.status(200).json({
    message: "Trans updated successfully!",
     updatedTrans
  });
});

const deleteTrans = catchAsyncError(async (req, res, next) => {
  const TransId = req.params;

  const deletedTrans = await findByIdAndDelete(TransId);

  if (!deletedTrans) {
    return res.status(404).json({ message: "Trans not found!" });
  }

  res.status(200).json({ message: "Trans deleted successfully!" });
});

export { createTrans, editTrans, deleteTrans, getAllTrans };
