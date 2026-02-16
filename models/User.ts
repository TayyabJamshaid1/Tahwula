import mongoose, { Mongoose, Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  name: string;
  userName: string;
  phoneNumber: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  role: string;
  provider: string;
  deletedAt?: Date;
}
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    required: function (this: IUser): boolean {
    return this.provider === "credentials";
  },
    },
    provider: {
      type: String,
      enum: ["credentials", "google","github"],
      default: "credentials",
    },
    role: {
      type: String,
      enum: ["admin", "simpleUser"],
      default: "simpleUser",
      required: true,
    },
    phoneNumber: {
      type: String,
      required: function (this: IUser): boolean {
    return this.provider === "credentials";
  },
    },
    password: {
      type: String,
   required: function (this: IUser): boolean {
    return this.provider === "credentials";
  },
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  //   next();
});

const User = models?.User || model<IUser>("User", userSchema);
export default User;
