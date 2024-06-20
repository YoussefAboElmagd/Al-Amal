import mongoose from "mongoose";

import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is a required field."],
      minLength: [2, "Name is too short."],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is a required field."],
      minLength: 6,
      unique: [true, "Email must be unique."],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long."],
    },
    profilePic: String,
    role: {
      type: String,
      enum: ["pharm", "rep", "admin", "admin"],
      default: "jobSeeker",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.post('init', (doc) => {
  doc.profilePic = process.env.BASE_URL +  "profilePic/" + doc.profilePic;
}) 

userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 10);
});
userSchema.pre("findOneAndUpdate", function () {
  this._update.password = bcrypt.hashSync(this._update.password, 10);
});

export const userModel = mongoose.model("user", userSchema);
