import { paymentModel } from "../../../database/models/payments.model.js";

const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createpayment = catchAsyncError(async (req, res, next) => {
  req.body.attachedResume = req.files.attachedResume[0].filename;
  console.log(req.files, "req.files");
  let newpayment = new paymentModel(req.body);
  let addedpayment = await newpayment.save();
  console.log(req.body);

  res.status(201).json({
    message: " payment has been created successfully!",
  });
});

const getAllpayment = catchAsyncError(async (req, res, next) => {
  // PAGINATION FEATURE
  // let page = req.query.page * 1 || 1;
  // if (req.query.page <= 0) page = 1;
  // let skip = (page - 1) * 4;
  // PAGINATION FEATURE

  let payment = await paymentModel.find();

  if (!payment) {
    return res.status(404).json({
      message: "No payment was found!",
    });
  }

  res.status(200).json({ message: "done", payment });
});

const searchpayment = catchAsyncError(async (req, res, next) => {
  let { paymentTitle } = req.params;
  console.log(req.query.p);
  const page = req.query.p - 1 || 0;
  const numOfpaymentPerPage = req.query.n || 5;
  let payment = await paymentModel
    .find({ jobTitle: { $regex: `${paymentTitle}`, $options: "i" } })
    .skip(page * numOfpaymentPerPage)
    .limit(numOfpaymentPerPage);
  if (!payment) {
    return res.status(404).json({
      message: "No payment was found!",
      s,
    });
  }

  res.status(200).json({ payment });
});

const getpaymentById = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;

  let payment = await paymentModel.findById(id);

  if (!payment) {
    return res.status(404).json({ message: "payment not found!" });
  }

  res.status(200).json({ payment });
});
const updatePayment = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let { name } = req.body;

  let updatedPayment = await paymentModel.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );

  if (!updatedPayment) {
    return res
      .status(404)
      .json({ message: "Couldn't update!  not found!" });
  }

  res.status(200).json({ message: "Payment updated successfully!",updatedPayment });
});
const deletePayment = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;

  let deletedPayment = await paymentModel.findByIdAndDelete({_id:id});

  if (!deletedPayment) {
    return res
      .status(404)
      .json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Payment deleted successfully!" });
});
export { createpayment, getAllpayment, searchpayment, getpaymentById, updatePayment, deletePayment };
