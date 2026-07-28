import { Router } from "express";
import { ExamScoreController } from "../controllers/examScore.controller.js";

export function createExamScoreRoutes(controller: ExamScoreController) {
  const router = Router();

  router.get("/look-up/:registrationNumber", (req, res, next) =>
    controller.getByRegistrationNumber(req, res, next),
  );
  router.get("/reports/statistics", (req, res, next) =>
    controller.getStatistics(req, res, next),
  );
  router.get("/reports/top-group-a", (req, res, next) =>
    controller.getTopGroupA(req, res, next),
  );

  return router;
}
