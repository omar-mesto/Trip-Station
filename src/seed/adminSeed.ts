
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/admin.model';

dotenv.config();

const seedAdmins = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const admins = [
    {
      name: 'Admin',
      email: 'admin1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      createdAt: new Date(),
    },
    {
      name: 'Admin2',
      email: 'admin2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      createdAt: new Date(),
    },
  ];

  await Admin.deleteMany({});
  await Admin.insertMany(admins);

  console.log('✅ Admins seeded successfully');
  process.exit();
};

seedAdmins();
