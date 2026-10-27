import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/database.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 5001;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`HireSense API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start HireSense API:", error);
    process.exit(1);
  }
};

void startServer();