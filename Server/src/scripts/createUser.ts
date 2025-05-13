import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model';

dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const userExists = await User.findOne({ username: 'user' });
    if (userExists) {
      console.log('User already exists');
      process.exit(0);
    }

    const user = await User.create({
      username: 'user',
      password: 'adminadmin',
      role: 'user',
    });

    console.log('User created successfully:', user);
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
};

createUser(); 