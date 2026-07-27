import "dotenv/config";
import { DatabaseService } from "../database.service.js";
import { SeederService } from "./seeder.service.js";
import type { SeedResult } from "./seeder.service.js";

/**
 * SeedRunner — Chạy seed dữ liệu CSV vào DB.
 *
 * Lưu ý: Bảng phải tồn tại trước khi seed.
 * Chạy migration trước nếu cần: `npm run migrate`
 */
class SeedRunner {
  private readonly dbService: DatabaseService;
  private readonly seederService: SeederService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
    this.seederService = new SeederService(this.dbService);
  }

  async run(): Promise<void> {
    this.printHeader();

    try {
      const result = await this.seederService.run();
      this.printResult(result);
    } catch (err) {
      console.error("\n[SeedRunner] ❌ Lỗi:", err);
      process.exitCode = 1;
    } finally {
      await this.dbService.close();
    }
  }

  private printHeader(): void {
    const line = "=".repeat(55);
    console.log(line);
    console.log("  SEED ĐIỂM THI THPT QUỐC GIA 2024");
    console.log(line + "\n");
  }

  private printResult(result: SeedResult): void {
    const elapsed = (result.elapsedMs / 1000).toFixed(1);
    console.log("\n📊 Kết quả seed:");
    console.log(`   Tổng batch  : ${result.totalBatches.toLocaleString()}`);
    console.log(`   Inserted    : ${result.totalInserted.toLocaleString()}`);
    console.log(`   Skipped     : ${result.totalSkipped.toLocaleString()} (trùng SBD)`);
    console.log(`   Thời gian   : ${elapsed}s`);
  }
}

// ─── Entrypoint ──────────────────────────────────────────────────────────────
new SeedRunner().run();
