import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection_string=process.env.MONGODB_CONNECTION_STRING;
    const conn = await mongoose.connect(connection_string||'');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;