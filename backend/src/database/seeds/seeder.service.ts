import { diemThi } from "../schema/index.js";
import type { NewDiemThi } from "../schema/index.js";
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
    csvFileName = "diem_thi_thpt_2024.csv",
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

    let batch: NewDiemThi[] = [];
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
   * Chuyển một dòng CSV thành NewDiemThi record.
   * Trả về null nếu dòng không hợp lệ (thiếu SBD).
   */
  private mapRowToRecord(row: CsvRow): NewDiemThi | null {
    const sbd = row.sbd?.trim();
    if (!sbd) return null;

    return {
      sbd,
      toan: parseScore(row.toan),
      ngu_van: parseScore(row.ngu_van),
      ngoai_ngu: parseScore(row.ngoai_ngu),
      vat_li: parseScore(row.vat_li),
      hoa_hoc: parseScore(row.hoa_hoc),
      sinh_hoc: parseScore(row.sinh_hoc),
      lich_su: parseScore(row.lich_su),
      dia_li: parseScore(row.dia_li),
      gdcd: parseScore(row.gdcd),
      ma_ngoai_ngu: row.ma_ngoai_ngu?.trim() || null,
    };
  }

  /**
   * Insert một batch vào DB.
   * Dùng ON CONFLICT DO NOTHING để idempotent (safe khi chạy nhiều lần).
   */
  private async insertBatch(records: NewDiemThi[]): Promise<BatchResult> {
    const rows = await this.dbService.db
      .insert(diemThi)
      .values(records)
      .onConflictDoNothing({ target: diemThi.sbd })
      .returning({ id: diemThi.id });

    return {
      inserted: rows.length,
      skipped: records.length - rows.length,
    };
  }

  /** Log tiến trình mỗi 10 batch. */
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
