import { migrate } from "drizzle-orm/node-postgres/migrator";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { DatabaseService } from "../database.service.js";

export class MigrationService {
  /** Thư mục chứa các file *.sql do drizzle-kit generate ra. */
  private readonly migrationsFolder: string;

  constructor(private readonly dbService: DatabaseService) {
    // __dirname trỏ đến src/database/migrations/ — đúng với drizzle.config.ts
    const __filename = fileURLToPath(import.meta.url);
    this.migrationsFolder = dirname(__filename);
  }

  /**
   * Áp dụng tất cả migration files chưa được chạy.
   * An toàn để gọi nhiều lần — Drizzle bỏ qua file đã apply.
   */
  async run(): Promise<void> {
    console.log("[MigrationService] 🔄 Đang apply migrations...");
    console.log(`[MigrationService] 📁 Folder: ${this.migrationsFolder}`);

    await migrate(this.dbService.db, {
      migrationsFolder: this.migrationsFolder,
    });

    console.log("[MigrationService] ✅ Migration hoàn tất.");
  }
}
