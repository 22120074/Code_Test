// index.ts
import express from "express";
import cors from "cors";
import { sql } from "drizzle-orm";
import { createExamScoreRoutes } from "./routes/examScore.routes.js";
import { DatabaseService } from "./database/database.service.js";
import { ExamScoreService } from "./services/examScore.service.js";
import { ExamScoreController } from "./controllers/examScore.controller.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());

async function startServer() {
  try {
    const dbService = DatabaseService.getInstance();
    const db = dbService.db;

    const examScoreService = new ExamScoreService(db);

    const examScoreController = new ExamScoreController(examScoreService);

    const examScoreRoutes = createExamScoreRoutes(examScoreController);
    app.use("/api/score", examScoreRoutes);

    app.get("/", (req, res) => {
      res.json({ message: "API is running" });
    });

    app.use(errorHandler);

    await db.execute(sql`SELECT 1`);
    console.log("Database connection successful.");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
