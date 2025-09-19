const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // always "user" when registering
    },
    addresses: [
      new mongoose.Schema(
        {
          label: { type: String, trim: true },
          line1: { type: String, required: [true, "Address line1 is required"], trim: true },
          line2: { type: String, trim: true },
          city: { type: String, required: [true, "City is required"], trim: true },
          state: { type: String, required: [true, "State is required"], trim: true },
          postalCode: { type: String, required: [true, "Postal code is required"], trim: true },
          country: { type: String, required: [true, "Country is required"], trim: true },
          isDefault: { type: Boolean, default: false },
        },
        { _id: true, timestamps: true }
      ),
    ],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
