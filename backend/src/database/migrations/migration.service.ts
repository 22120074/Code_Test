import { migrate } from "drizzle-orm/node-postgres/migrator";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { DatabaseService } from "../database.service.js";

export class MigrationService {
  private readonly migrationsFolder: string;

  constructor(private readonly dbService: DatabaseService) {
    const __filename = fileURLToPath(import.meta.url);
    this.migrationsFolder = dirname(__filename);
  }

  async run(): Promise<void> {
    console.log("[MigrationService] 🔄 Đang apply migrations...");
    console.log(`[MigrationService] 📁 Folder: ${this.migrationsFolder}`);

    await migrate(this.dbService.db, {
      migrationsFolder: this.migrationsFolder,
    });

    console.log("[MigrationService] ✅ Migration hoàn tất.");
  }
}
