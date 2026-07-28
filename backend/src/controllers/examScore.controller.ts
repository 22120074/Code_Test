import type { Request, Response, NextFunction } from "express";
import type { ExamScoreService } from "../services/examScore.service.js";
import { Success } from "../core/success.response.js";
import { AppError } from "../core/error.response.js";

export class ExamScoreController {
  constructor(private readonly examScoreService: ExamScoreService) {}

  async getByRegistrationNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const registrationNumber = req.params.registrationNumber as string;
      if (!registrationNumber) {
        throw AppError.BadRequest("Registration number is required");
      }

      const score = await this.examScoreService.getScoreByRegistrationNumber(registrationNumber);
      if (!score) {
        throw AppError.NotFound("Score not found for the given registration number");
      }

      Success(res, score, "Success");
    } catch (e) {
      next(e);
    }
  }

  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.examScoreService.getStatistics();
      Success(res, stats, "Success");
    } catch (e) {
      next(e);
    }
  }

  async getTopGroupA(req: Request, res: Response, next: NextFunction) {
    try {
      const top = await this.examScoreService.getTop10GroupA();
      Success(res, top, "Success");
    } catch (e) {
      next(e);
    }
  }
}
