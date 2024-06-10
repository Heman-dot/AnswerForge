import mongoose from 'mongoose';

const connectDB = async () => {
  // Debug: Log the connection URL to ensure it is not undefined
  console.log("Connecting to MongoDB with URL:", process.env.CONNECTION_URL);

  try {
    const conn = await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
