import { Router } from "express";
import { DiemThiController } from "../controllers/diemthi.controller.js";

export function createDiemThiRoutes(controller: DiemThiController) {
  const router = Router();

  router.get("/look-up/:sbd", (req, res, next) =>
    controller.getBySbd(req, res, next),
  );
  router.get("/reports/statistics", (req, res, next) =>
    controller.getStatistics(req, res, next),
  );
  router.get("/reports/top-group-a", (req, res, next) =>
    controller.getTopGroupA(req, res, next),
  );

  return router;
}
