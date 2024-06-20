import { notificationModel } from "../../../database/models/notification.model.js";

const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const getAllNotification = catchAsyncError(async (req, res, next) => {
  let results = await notificationModel.find();
  res.json({ message: "done", results });
});

const createNotification = catchAsyncError(async (req, res, next) => {
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  const newNotif = new notificationModel(req.body);
  const savedNotif = await newNotif.save();

  res.status(201).json({
    message: "notification created successfully!",
    post: savedNotif,
  });
});


const deleteNotification = catchAsyncError(async (req, res, next) => {
  const notifId = req.params.notifId;

  const deletedNotification = await notificationModel.findByIdAndDelete(notifId);

  if (!deletedNotification) {
    return res.status(404).json({ message: "notification not found!" });
  }

  res.status(200).json({ message: "notification deleted successfully!" });
});

export { createNotification, deleteNotification,getAllNotification };
