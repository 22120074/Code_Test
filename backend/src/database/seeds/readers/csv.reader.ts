import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { parse } from "csv-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

export function parseScore(raw: string | undefined): string | null {
  if (raw === undefined || raw.trim() === "") return null;
  const n = parseFloat(raw.trim());
  return isNaN(n) ? null : n.toFixed(2);
}

export class CsvReader {
  private readonly filePath: string;

  constructor(fileName: string) {
    this.filePath = join(__dirname, "..", "data", fileName);
  }

  async *read(): AsyncGenerator<CsvRow> {
    const stream = createReadStream(this.filePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      }),
    );

    for await (const row of stream as AsyncIterable<CsvRow>) {
      yield row;
    }
  }

  getFilePath(): string {
    return this.filePath;
  }
}
