import "dotenv/config";
import { DatabaseService } from "../database.service.js";
import { SeederService } from "./seeder.service.js";
import type { SeedResult } from "./seeder.service.js";

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
      console.error("\n[SeedRunner] ❌ Error:", err);
      process.exitCode = 1;
    } finally {
      await this.dbService.close();
    }
  }

  private printHeader(): void {
    const line = "=".repeat(55);
    console.log(line);
    console.log("  SEED 2024 NATIONAL HIGH SCHOOL EXAM SCORES");
    console.log(line + "\n");
  }

  private printResult(result: SeedResult): void {
    const elapsed = (result.elapsedMs / 1000).toFixed(1);
    console.log("\n📊 Seed Results:");
    console.log(`   Total batches : ${result.totalBatches.toLocaleString()}`);
    console.log(`   Inserted      : ${result.totalInserted.toLocaleString()}`);
    console.log(
      `   Skipped       : ${result.totalSkipped.toLocaleString()} (duplicate registration numbers)`,
    );
    console.log(`   Elapsed time  : ${elapsed}s`);
  }
}

new SeedRunner().run();
