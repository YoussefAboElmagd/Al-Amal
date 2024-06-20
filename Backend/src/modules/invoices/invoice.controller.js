import { invoiceModel } from "../../../database/models/invoice.model.js";

const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createInvoice = catchAsyncError(async (req, res, next) => {
  req.body.image = req.files.image[0].filename;
  console.log(req.files, "req.files");
  let newInvoice = new invoiceModel(req.body);
  let addedInvoice = await newInvoice.save();
  console.log(req.body);

  res.status(201).json({
    message: "Job Invoice has been created successfully!",
  });
});

const getAllInvoice = catchAsyncError(async (req, res, next) => {
  const page = req.query.p - 1 || 0;
  const numOfInvoicePerPage = req.query.n || 5;
  let Invoice = await invoiceModel
    .find()
    .skip(page * numOfInvoicePerPage)
    .limit(numOfInvoicePerPage);
  if (!Invoice) {
    return res.status(404).json({
      message: "No Invoice was found!",
    });
  }

  res.status(200).json({ message: "done", Invoice });
});

const searchInvoice = catchAsyncError(async (req, res, next) => {
  let { InvoiceTitle ,filterType,filterValue} = req.params;
  const page = req.query.p - 1 || 0;
  let Invoice = null;
  if(req.query.filter){

    switch(filterType){
      case "user": await invoiceModel.find({ id: { $regex: `${filterValue}`, $options: "i" } })
      break;
      case "loc": await invoiceModel.find({ id: { $regex: `${filterValue}`, $options: "i" } })
      break;
  
    }
  }
  const numOfInvoicePerPage = req.query.n || 5;
  Invoice = await invoiceModel
    .find({ jobTitle: { $regex: `${InvoiceTitle}`, $options: "i" } })
    .skip(page * numOfInvoicePerPage)
    .limit(numOfInvoicePerPage);
  if (!Invoice) {
    return res.status(404).json({
      message: "No Invoice was found!",
      s,
    });
  }

  res.status(200).json({ Invoice });
});

const getInvoiceById = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;

  let Invoice = await invoiceModel.findById(id);

  if (!Invoice) {
    return res.status(404).json({ message: "Invoice not found!" });
  }

  res.status(200).json({ Invoice });
});
const updateInvoice = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;

  let updatedInvoice = await invoiceModel.findByIdAndUpdate(
    id,
     req.body,
    { new: true }
  );

  if (!updatedInvoice) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }

  res.status(200).json({ message: "Invoice updated successfully!" ,updatedInvoice});
});
const deleteInovice = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;

  let deletedInvoice = await invoiceModel.findByIdAndDelete({ _id: id });

  if (!deletedInvoice) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Invoice deleted successfully!" });
});

export {
  createInvoice,
  getAllInvoice,
  searchInvoice,
  getInvoiceById,
  deleteInovice,
  updateInvoice,
};
