import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { parse } from "csv-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface CsvRow {
  registrationNumber: string;
  math?: string;
  literature?: string;
  foreignLanguage?: string;
  physics?: string;
  chemistry?: string;
  biology?: string;
  history?: string;
  geography?: string;
  civicEducation?: string;
  foreignLanguageCode?: string;
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
        columns: [
          'registrationNumber',
          'math',
          'literature',
          'foreignLanguage',
          'physics',
          'chemistry',
          'biology',
          'history',
          'geography',
          'civicEducation',
          'foreignLanguageCode',
        ],
        from_line: 2,
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
