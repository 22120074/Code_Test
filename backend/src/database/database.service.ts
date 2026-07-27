import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { envConfig } from "../config/env.js";
import * as schema from "./schema/index.js";

const { Pool } = pg;

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

/**
 * DatabaseService — Singleton quản lý vòng đời kết nối PostgreSQL.
 *
 * Trách nhiệm:
 *  - Khởi tạo pg.Pool với cấu hình từ EnvConfig
 *  - Cung cấp instance Drizzle ORM
 *  - Xử lý lỗi pool và đóng kết nối khi cần
 */
export class DatabaseService {
  private static instance: DatabaseService;

  private readonly _pool: pg.Pool;
  private readonly _db: DrizzleDb;

  private constructor() {
    this._pool = new Pool({
      connectionString: envConfig.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

    this._pool.on("error", (err: Error) => {
      console.error("[DatabaseService] Lỗi pool không mong đợi:", err.message);
    });

    this._db = drizzle(this._pool, { schema });
  }

  /** Lấy singleton instance. */
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /** Drizzle ORM instance (type-safe query builder). */
  get db(): DrizzleDb {
    return this._db;
  }

  /** pg.Pool gốc (dùng khi cần raw client). */
  get pool(): pg.Pool {
    return this._pool;
  }

  /** Đóng tất cả kết nối trong pool. */
  async close(): Promise<void> {
    await this._pool.end();
    console.log("[DatabaseService] Đã đóng connection pool.");
  }
}

export const databaseService = DatabaseService.getInstance();
