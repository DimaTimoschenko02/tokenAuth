import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUserDocument extends mongoose.Document {
  id: string;
  id_type: "email" | "phone";
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    id_type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as IUserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};
const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
