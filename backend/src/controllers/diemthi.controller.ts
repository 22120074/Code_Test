import type { Request, Response, NextFunction } from "express";
import type { DiemThiService } from "../services/diemthi.service.js";
import { Success } from "../core/success.response.js";
import { AppError } from "../core/error.response.js";

export class DiemThiController {
  constructor(private readonly diemThiService: DiemThiService) {}

  async getBySbd(req: Request, res: Response, next: NextFunction) {
    try {
      const sbd = req.params.sbd as string;
      if (!sbd) {
        throw AppError.BadRequest("SBD is required");
      }

      const score = await this.diemThiService.getScoreBySbd(sbd);
      if (!score) {
        throw AppError.NotFound("Score not found for the given SBD");
      }

      Success(res, score, "Success");
    } catch (e) {
      next(e);
    }
  }

  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.diemThiService.getStatistics();
      Success(res, stats, "Success");
    } catch (e) {
      next(e);
    }
  }

  async getTopGroupA(req: Request, res: Response, next: NextFunction) {
    try {
      const top = await this.diemThiService.getTop10GroupA();
      Success(res, top, "Success");
    } catch (e) {
      next(e);
    }
  }
}
