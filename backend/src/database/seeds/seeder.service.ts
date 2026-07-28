import { examScore } from "../schema/index.js";
import type { NewExamScore } from "../schema/index.js";
import { envConfig } from "../../config/env.js";
import type { DatabaseService } from "../database.service.js";
import { CsvReader, parseScore } from "./readers/index.js";
import type { CsvRow } from "./readers/index.js";

interface BatchResult {
  inserted: number;
  skipped: number;
}

export interface SeedResult {
  totalBatches: number;
  totalInserted: number;
  totalSkipped: number;
  elapsedMs: number;
}

export class SeederService {
  private readonly csvReader: CsvReader;
  private readonly batchSize: number;

  constructor(
    private readonly dbService: DatabaseService,
    csvFileName = "exam_scores_2024.csv",
  ) {
    this.csvReader = new CsvReader(csvFileName);
    this.batchSize = envConfig.seedBatchSize;
  }

  async run(): Promise<SeedResult> {
    const startMs = Date.now();
    console.log(`[SeederService] 📂 CSV: ${this.csvReader.getFilePath()}`);
    console.log(
      `[SeederService] 📦 Batch size: ${this.batchSize.toLocaleString()}\n`,
    );

    let batch: NewExamScore[] = [];
    let totalInserted = 0;
    let totalSkipped = 0;
    let totalBatches = 0;

    for await (const row of this.csvReader.read()) {
      const record = this.mapRowToRecord(row);
      if (!record) continue;

      batch.push(record);

      if (batch.length >= this.batchSize) {
        const result = await this.insertBatch(batch);
        totalInserted += result.inserted;
        totalSkipped += result.skipped;
        totalBatches++;
        this.logProgress(totalBatches, totalInserted, totalSkipped);
        batch = [];
      }
    }

    if (batch.length > 0) {
      const result = await this.insertBatch(batch);
      totalInserted += result.inserted;
      totalSkipped += result.skipped;
      totalBatches++;
    }

    return {
      totalBatches,
      totalInserted,
      totalSkipped,
      elapsedMs: Date.now() - startMs,
    };
  }

  /**
   * Convert a CSV row into a NewExamScore record.
   * Returns null if the row is invalid (missing Registration Number).
   */
  private mapRowToRecord(row: CsvRow): NewExamScore | null {
    const sbd = row.registrationNumber?.trim();
    if (!sbd) return null;

    return {
      registrationNumber: sbd,
      math: parseScore(row.math),
      literature: parseScore(row.literature),
      foreignLanguage: parseScore(row.foreignLanguage),
      physics: parseScore(row.physics),
      chemistry: parseScore(row.chemistry),
      biology: parseScore(row.biology),
      history: parseScore(row.history),
      geography: parseScore(row.geography),
      civicEducation: parseScore(row.civicEducation),
      foreignLanguageCode: row.foreignLanguageCode?.trim() || null,
    };
  }

  /**
   * Insert a batch into the DB.
   * Use ON CONFLICT DO NOTHING for idempotency (safe for multiple runs).
   */
  private async insertBatch(records: NewExamScore[]): Promise<BatchResult> {
    const rows = await this.dbService.db
      .insert(examScore)
      .values(records)
      .onConflictDoNothing({ target: examScore.registrationNumber })
      .returning({ id: examScore.id });

    return {
      inserted: rows.length,
      skipped: records.length - rows.length,
    };
  }

  /** Log progress every 10 batches. */
  private logProgress(
    batchCount: number,
    inserted: number,
    skipped: number,
  ): void {
    if (batchCount % 10 !== 0) return;
    console.log(
      `[SeederService] Batch #${batchCount} | ` +
        `Inserted: ${inserted.toLocaleString()} | ` +
        `Skipped: ${skipped.toLocaleString()}`,
    );
  }
}
