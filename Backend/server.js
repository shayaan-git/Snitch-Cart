import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
