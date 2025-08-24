import mongoose, { Document, Schema } from 'mongoose';
// import bcrypt from 'bcryptjs'; // commented out for MD5 demo; uncomment to restore bcrypt
import crypto from 'crypto';

export interface IUser extends Document {
  username: string;
  password: string;
  email?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (this: IUser & Document, next: any) {
  const doc = this as IUser & Document;
  if (!doc.isModified('password')) return next();

  // --- bcrypt implementation (commented out for presentation) ---
  // const salt = await bcrypt.genSalt(10);
  // doc.password = await bcrypt.hash(doc.password, salt);
  // next();
  // -------------------------------------------------------------

  // MD5 demonstration - NOT SECURE. Replace with bcrypt in production.
  const md5 = crypto.createHash('md5').update(String(doc.password)).digest('hex');
  doc.password = md5;
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  this: IUser & Document,
  candidatePassword: string
): Promise<boolean> {
  // MD5 comparison for presentation only. Not secure.
  const candidateHash = crypto.createHash('md5').update(String(candidatePassword)).digest('hex');
  return candidateHash === this.password;
  // Original bcrypt implementation (commented out):
  // return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);