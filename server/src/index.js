import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

async function start() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`PrintX server listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start PrintX server", error);
  process.exit(1);
});
