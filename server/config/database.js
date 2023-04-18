import mongoose from 'mongoose';
export const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost/MyTube');
    console.log('Connected to DB');
  } catch (error) {
    throw error;
  }
};
