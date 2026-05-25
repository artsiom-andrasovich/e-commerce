import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();
const PORT: number = 3001;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);

    app.listen(PORT, () => {
      console.log(`Products service started on port = ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
