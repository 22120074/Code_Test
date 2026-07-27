import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { parse } from "csv-parse";

// ─── Path helpers ────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Types ───────────────────────────────────────────────────────────────────

/** Kiểu dữ liệu một dòng CSV sau khi parse header. */
export interface CsvRow {
  sbd: string;
  toan?: string;
  ngu_van?: string;
  ngoai_ngu?: string;
  vat_li?: string;
  hoa_hoc?: string;
  sinh_hoc?: string;
  lich_su?: string;
  dia_li?: string;
  gdcd?: string;
  ma_ngoai_ngu?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Chuyển chuỗi CSV thành string dạng số hoặc null.
 * Drizzle ORM nhận NUMERIC dưới dạng string.
 */
export function parseScore(raw: string | undefined): string | null {
  if (raw === undefined || raw.trim() === "") return null;
  const n = parseFloat(raw.trim());
  return isNaN(n) ? null : n.toFixed(2);
}

// ─── CsvReader ───────────────────────────────────────────────────────────────

/**
 * CsvReader — Đọc file CSV theo stream và yield từng dòng dưới dạng CsvRow.
 *
 * Trách nhiệm duy nhất: IO (đọc file, parse CSV).
 * Không biết về database hay business logic.
 *
 * File CSV phải nằm trong thư mục `../data/` tương đối với readers/.
 */
export class CsvReader {
  private readonly filePath: string;

  /**
   * @param fileName - Tên file CSV (VD: "diem_thi_thpt_2024.csv").
   *                   File sẽ được tìm trong `seeds/data/<fileName>`.
   */
  constructor(fileName: string) {
    // readers/ nằm trong seeds/, data/ cũng nằm trong seeds/
    this.filePath = join(__dirname, "..", "data", fileName);
  }

  /** Async generator: yield từng dòng CSV đã parse. */
  async *read(): AsyncGenerator<CsvRow> {
    const stream = createReadStream(this.filePath).pipe(
      parse({
        columns: true,           // dòng 1 là header
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      })
    );

    for await (const row of stream as AsyncIterable<CsvRow>) {
      yield row;
    }
  }

  /** Trả về đường dẫn tuyệt đối của file CSV. */
  getFilePath(): string {
    return this.filePath;
  }
}
