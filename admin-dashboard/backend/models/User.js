import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["Administrator", "Editor", "Viewer"],
      default: "Viewer",
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, record) {
        delete record.password;
        delete record.__v;
        return record;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
