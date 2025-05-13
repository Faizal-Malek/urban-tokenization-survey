import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const adminExists = await User.findOne({ username: 'Admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      username: 'Admin',
      password: 'passwordAdmin1',
      role: 'admin',
    });

    console.log('Admin user created successfully:', admin);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser(); 