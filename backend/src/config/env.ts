import "dotenv/config";

export class EnvConfig {
  private static instance: EnvConfig;

  readonly databaseUrl: string;
  readonly dbHost: string;
  readonly dbPort: number;
  readonly dbName: string;
  readonly dbUser: string;
  readonly dbPassword: string;
  readonly seedBatchSize: number;

  private constructor() {
    this.databaseUrl = this.require("DATABASE_URL");
    this.dbHost = this.get("DB_HOST", "localhost");
    this.dbPort = parseInt(this.get("DB_PORT", "5432"), 10);
    this.dbName = this.get("DB_NAME", "exam_scores");
    this.dbUser = this.get("DB_USER", "postgres");
    this.dbPassword = this.require("DB_PASSWORD");
    this.seedBatchSize = parseInt(this.get("SEED_BATCH_SIZE", "1000"), 10);
  }

  /** Return env value, throw if missing. */
  private require(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(
        `[EnvConfig] Required environment variable "${key}" is missing.`,
      );
    }
    return value;
  }

  /** Return env value or default. */
  private get(key: string, defaultValue: string): string {
    return process.env[key] ?? defaultValue;
  }

  /** Get singleton instance (lazy init). */
  static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }
    return EnvConfig.instance;
  }
}

export const envConfig = EnvConfig.getInstance();
