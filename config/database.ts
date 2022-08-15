import config from "config";
import { ConnectOptions, connect } from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI: string = config.get("mongoURI");
    
    await connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("MongoDB Connected...");
  } catch (err: any) {

    console.error(err.message);

    process.exit(1);
  }
};

export default connectDB;