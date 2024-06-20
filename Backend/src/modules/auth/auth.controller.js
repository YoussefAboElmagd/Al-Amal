import { userModel } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

export const signUp = catchAsyncError(async (req, res, next) => {
  let isFound = await userModel.findOne({ email: req.body.email });

  if (isFound) {
    return res.status(409).json({
      message: "Email already exists!",
    });
  }

  let user = new userModel(req.body);
  await user.save();

  res.json({ message: "User was added successfully!", user });
});

export const signIn = catchAsyncError(async (req, res, next) => {
  let { email, password } = req.body;

  let isFound = await userModel.findOne({ email });
  const match = await bcrypt.compare(password, isFound.password);

  if (isFound && match) {
    let token = jwt.sign(
      { name: isFound.name, userId: isFound._id, role: isFound.role },
      process.env.JWT_SECRET
    );
    return res.json({ message: "success", token });
  } else {
    return res.status(401).json({
      message: "Incorrect email or password!",
    });
  }
});

export const protectedRoutes = catchAsyncError(async (req, res, next) => {
  let { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      message: "Please provide a token first! User must be logged in!",
    });
  }

  let decoded = await jwt.verify(token, process.env.JWT_SECRET);

  let user = await userModel.findById(decoded.userId);

  if (!user) {
    return res.json({
      message: "Sorry! User was recently deleted! Token is not valid anymore!",
    });
  }

  req.user = user;



  next();
});

export const allowTo = (...roles) => {
  return catchAsyncError((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Sorry! You are not authorized to do such action!",
      });
    }

    next();
  });
};
