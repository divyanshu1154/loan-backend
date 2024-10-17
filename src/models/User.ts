import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

enum UserRole {
  User = 'user',
  Admin = 'admin',
}

interface IUser extends Document{
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isPasswordValid(password: string): Promise<boolean>;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: UserRole, default: UserRole.User },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.isPasswordValid = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', userSchema);
export default User;
export { UserRole };
